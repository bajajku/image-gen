"use client";

import { useState, useEffect } from "react";
// import Image from "next/image";
import Link from "next/link";

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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setGeneratedImage(null);
    
    try {
      const response = await fetch("http://localhost:8080/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId: selectedModel,
          prompt: prompt,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
      
      const data = await response.json();
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        throw new Error("No image URL returned");
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Error generating image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg text-center">
        <p>Loading models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-8">
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            Generate Images
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Create stunning AI-generated images with your trained models</p>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-purple-100 dark:border-purple-900">
          <form onSubmit={handleGenerateImage} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Model
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={handleModelChange}
                  required
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 pr-10 appearance-none"
                >
                  <option value="">Select a model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.category}
                    </option>
                  ))}
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
                Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={handlePromptChange}
                  required
                  rows={5}
                  placeholder="Describe the image you want to generate..."
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3"
                />
                <div className="absolute right-3 bottom-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Tip: Be specific about style, colors, and subject matter
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isGenerating || !selectedModel || !prompt}
              className="w-full py-3 px-4 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 disabled:hover:translate-y-0"
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
          
          {/* Result display would go here */}
        </div>
        
        {/* Return to home button */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 