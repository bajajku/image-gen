import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-8 pb-20 sm:p-20">
      <main className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col items-center w-full mb-10">
          <div className="relative">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-center">
              AI Image Generator
            </h1>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 mt-6 text-center max-w-xl">
            Train your own AI model and generate stunning custom images with just a few clicks
          </p>
          
          <div className="w-full max-w-lg">
            <Tabs defaultValue="train" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
                <TabsTrigger 
                  value="train" 
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg py-3 transition-all duration-300"
                >
                  Train New Model
                </TabsTrigger>
                <TabsTrigger 
                  value="generate" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg py-3 transition-all duration-300"
                >
                  Generate Images
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="train" className="mt-8">
                <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-indigo-100 dark:border-indigo-900 transition-all hover:shadow-indigo-200/30 dark:hover:shadow-indigo-700/20">
                  <p className="mb-6 text-gray-700 dark:text-gray-300">Upload images to train your custom AI model with your own style and content</p>
                  <Link 
                    href="/train" 
                    className="rounded-xl transition-all flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white gap-2 font-medium text-base h-14 px-6 w-full text-center shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Train New Model
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="generate" className="mt-8">
                <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-purple-100 dark:border-purple-900 transition-all hover:shadow-purple-200/30 dark:hover:shadow-purple-700/20">
                  <p className="mb-6 text-gray-700 dark:text-gray-300">Create stunning images with your trained AI models using simple text prompts</p>
                  <Link 
                    href="/generate" 
                    className="rounded-xl transition-all flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 font-medium text-base h-14 px-6 w-full text-center shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Generate Images
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Visual divider with decorative elements */}
        <div className="relative w-full flex items-center justify-center my-6">
          <div className="absolute left-0 w-1/3 h-px bg-gradient-to-r from-transparent to-indigo-300 dark:to-indigo-700"></div>
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center z-10 shadow-md">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full"></div>
          </div>
          <div className="absolute right-0 w-1/3 h-px bg-gradient-to-l from-transparent to-purple-300 dark:to-purple-700"></div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="bg-white/80 dark:bg-gray-800/40 p-8 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/50 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">How it works</h2>
            </div>
            <ol className="list-decimal pl-8 space-y-3 text-gray-700 dark:text-gray-300">
              <li className="transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400">Upload a ZIP file with training images</li>
              <li className="transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400">Configure your model settings</li>
              <li className="transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400">Start training your AI model</li>
              <li className="transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400">Generate custom images with your trained model</li>
            </ol>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/40 p-8 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/50 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tips for best results</h2>
            </div>
            <ul className="list-disc pl-8 space-y-3 text-gray-700 dark:text-gray-300">
              <li className="transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400">Use high-quality, consistent images</li>
              <li className="transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400">Include at least 10-20 images in your training set</li>
              <li className="transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400">Choose clear, descriptive prompts for generation</li>
              <li className="transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400">Experiment with different settings</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto mt-16 text-center">
        <div className="py-4 border-t border-indigo-100 dark:border-indigo-900/30">
          <p className="text-gray-500 dark:text-gray-400">AI Image Generator - Upload and train your own models</p>
        </div>
      </footer>
    </div>
  );
}
