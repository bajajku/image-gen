"use client";

import { useState, useEffect } from "react";
// import Image from "next/image";
import Link from "next/link";
import { downloadImage, downloadAllImages } from '@/utils/downloadUtils';

type Model = {
  id: string;
  name: string;
  category: string;
  theme: string;
  focalPoint: string;
  mood: string;
  primaryColor: string;
  tensorPath?: string;
};

export default function GenerateImagesPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numImages, setNumImages] = useState<number>(1);
  const [generationStatus, setGenerationStatus] = useState<string>("");

  useEffect(() => {
    // Fetch available models
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:8080/models");
        
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        
        const data = await response.json();
        setModels(data.models || []);
      } catch (error) {
        console.error("Error fetching models:", error);
        setError("Failed to load models. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedModel || !prompt) {
        alert("Please select a model and enter a prompt");
        return;
    }
    
    setIsGenerating(true);
    setGeneratedImages([]);
    setGenerationStatus("Submitting generation request...");
    
    try {
        const response = await fetch("http://localhost:8080/ai/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                modelId: selectedModel,
                prompt: prompt,
                numImages: numImages
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to generate images: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.imageUrls && data.imageUrls.length > 0) {
            setGenerationStatus("Generation completed!");
            setGeneratedImages(data.imageUrls);
        } else {
            throw new Error("No image URLs returned");
        }
    } catch (error) {
        console.error("Generation error:", error);
        setGenerationStatus("Error: " + (error as Error).message);
        alert("Error generating images. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      await downloadImage(imageUrl, `generated-image-${index + 1}.png`);
    } catch (error) {
      alert('Failed to download image. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadAllImages(generatedImages);
    } catch (error) {
      alert('Failed to download images. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950">
        <div className="glass p-8 rounded-xl shadow-xl max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">
            <svg className="w-full h-full text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-high-contrast text-lg">Loading models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950">
        <div className="glass p-8 rounded-xl shadow-xl max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950 p-8">
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 gradient-text">
            Generate Images
          </h1>
          <p className="text-high-contrast">Create stunning AI-generated images with your trained models</p>
        </div>
        
        <div className="glass p-8 rounded-xl shadow-xl border border-purple-100/50 dark:border-purple-900/50">
          <form onSubmit={handleGenerateImage} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-high-contrast mb-2">
                Select Model
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={handleModelChange}
                  required
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 pr-10 appearance-none text-high-contrast"
                >
                  <option value="">Select a model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="h-5 w-5 text-high-contrast opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-high-contrast mb-2">
                Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={handlePromptChange}
                  required
                  rows={5}
                  placeholder="Describe the image you want to generate..."
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 text-high-contrast"
                />
                <div className="absolute right-3 bottom-3 text-high-contrast opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-high-contrast opacity-80">
                Tip: Be specific about style, colors, and subject matter
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-high-contrast mb-2">
                Number of Images
              </label>
              <select
                value={numImages}
                onChange={(e) => setNumImages(Number(e.target.value))}
                className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 text-high-contrast"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Image' : 'Images'}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isGenerating || !selectedModel || !prompt}
              className="w-full py-3 px-4 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift disabled:hover:transform-none"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Generate Image
                </span>
              )}
            </button>
          </form>
          
          {isGenerating && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <p className="text-high-contrast">{generationStatus}</p>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {generatedImages.length > 0 && (
          <div className="mt-8 glass p-8 rounded-xl shadow-xl border border-purple-100/50 dark:border-purple-900/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-high-contrast">Generated Images</h2>
              {generatedImages.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
                >
                  Download All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={imageUrl} 
                      alt={`Generated image ${index + 1}`} 
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownload(imageUrl, index)}
                      className="p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}