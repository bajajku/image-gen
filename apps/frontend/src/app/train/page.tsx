"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";

export default function TrainModelPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedZipUrl, setUploadedZipUrl] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "Tech",
    theme: "Modern",
    focalPoint: "Product",
    mood: "Professional",
    primaryColor: "#000000"
  });

  useEffect(() => {
    alert("Training is currently disabled due to low funds. Please try again later.");
  }, []);

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    alert("Training is currently disabled due to low funds. Please try again later.");
    return;
    
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (images.length + newImages.length > 30) {
      alert("Maximum 30 images allowed");
      return;
    }
    
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const zipAndUploadImages = async () => {
    alert("Training is currently disabled due to low funds. Please try again later.");
    return;
    
    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    setIsUploading(true);
    try {
      // Create zip file
      const zip = new JSZip();
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageData = await image.arrayBuffer();
        zip.file(`image_${i+1}${image.name.substring(image.name.lastIndexOf('.'))}`, imageData);
      }
      
      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipFile = new File([zipContent], "training_images.zip", { type: "application/zip" });

      // Get pre-signed URL
      const presignedRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pre-signed-url`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!presignedRes.ok) {
        throw new Error(`Server responded with status: ${presignedRes.status}`);
      }

      const { url, key } = await presignedRes.json();
      console.log(url);
      console.log(key);

      // Upload zip to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: zipFile,
        headers: {
          "Content-Type": "application/zip",
        },
      });

      if (uploadRes.ok) {
        const fileUrl = url.split("?")[0]; // Remove query params to get base URL
        setUploadedZipUrl(fileUrl);
        alert("Images uploaded successfully!");
      } else {
        alert("Failed to upload images");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Training is currently disabled due to low funds. Please try again later.");
    return;
    
    if (!uploadedZipUrl) {
      alert("Please upload images first");
      return;
    }

    setIsTraining(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          zipUrl: uploadedZipUrl,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Model training started! Model ID: ${data.modelId}`);
        router.push("/"); // Redirect to home page
      } else {
        alert(`Training failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Training error:", error);
      alert("Error starting model training");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Train New AI Model</h1>
        
        {/* Add notice banner */}
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-8 rounded-md shadow-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium">Training is currently disabled due to low funds. Please try again later.</p>
          </div>
        </div>
        
        {/* Image Upload Section */}
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-indigo-100 dark:border-indigo-900 transition-all hover:shadow-indigo-200/30 dark:hover:shadow-indigo-700/20 mb-8 opacity-50 pointer-events-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upload Training Images</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Upload up to 30 high-quality images to train your custom AI model.
          </p>
          
          <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesUpload}
              disabled={isUploading || images.length >= 30}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-indigo-50 file:text-indigo-600
                dark:file:bg-indigo-900/50 dark:file:text-indigo-400
                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800/50
                disabled:opacity-50"
            />
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {images.length} of 30 images selected
              </p>
              
              {images.length > 0 && (
                <div className="grid grid-cols-6 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Training image ${index + 1}`}
                        className="rounded-lg w-full h-full object-cover ring-1 ring-indigo-100 dark:ring-indigo-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={zipAndUploadImages}
                disabled={isUploading || images.length === 0}
                className="mt-6 w-full h-14 rounded-xl transition-all flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white gap-2 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40"
              >
                {isUploading ? "Uploading..." : "Upload Images"}
              </button>
            </div>
            
            {uploadedZipUrl && (
              <p className="mt-3 text-sm text-green-500 dark:text-green-400 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Images uploaded successfully!
              </p>
            )}
          </div>
        </div>

        {/* Model Configuration Form */}
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-indigo-100 dark:border-indigo-900 transition-all hover:shadow-indigo-200/30 dark:hover:shadow-indigo-700/20 opacity-50 pointer-events-none">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Model Configuration</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3"
                  placeholder="Enter model name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 pr-10 appearance-none"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Finance">Finance</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <div className="relative">
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 pr-10 appearance-none"
                  >
                    <option value="Minimalist">Minimalist</option>
                    <option value="Bold">Bold</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Modern">Modern</option>
                    <option value="Dark">Dark</option>
                    <option value="Light">Light</option>
                    <option value="Neon">Neon</option>
                    <option value="Elegant">Elegant</option>
                    <option value="Playful">Playful</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Focal Point
                </label>
                <div className="relative">
                  <select
                    name="focalPoint"
                    value={formData.focalPoint}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 pr-10 appearance-none"
                  >
                    <option value="Text">Text</option>
                    <option value="Product">Product</option>
                    <option value="Person">Person</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Illustration">Illustration</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mood
                </label>
                <div className="relative">
                  <select
                    name="mood"
                    value={formData.mood}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 pr-10 appearance-none"
                  >
                    <option value="Energetic">Energetic</option>
                    <option value="Calm">Calm</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Casual">Casual</option>
                    <option value="Serious">Serious</option>
                    <option value="Playful">Playful</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!uploadedZipUrl || isTraining}
              className="w-full h-14 rounded-xl transition-all flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white gap-2 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 mt-8"
            >
              {isTraining ? "Starting Training..." : "Train Model"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 