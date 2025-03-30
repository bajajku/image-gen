"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import dynamic from 'next/dynamic';


export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Semi-transparent overlay to improve content readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 dark:from-gray-900/90 dark:via-indigo-950/90 dark:to-purple-950/90 -z-10"></div>
      
      <div className="relative z-10 py-16 px-4">
        <main className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="relative mb-6 floating">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="font-bold mb-6 gradient-text text-6xl/[92px]">
              SynthLabel
            </h1>
            <p className="text-xl text-high-contrast max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into stunning visuals with our advanced AI image generation platform. Train custom models and create unique artwork in minutes.
            </p>

            <div className="mt-12 w-full max-w-3xl">
              <Tabs defaultValue="train" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1 glass">
                  <TabsTrigger 
                    value="train" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-xl py-4 transition-all duration-300 hover-lift"
                  >
                    Train New Model
                  </TabsTrigger>
                  <TabsTrigger 
                    value="generate" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white rounded-xl py-4 transition-all duration-300 hover-lift"
                  >
                    Generate Images
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="train">
                  <div className="mt-6 glass rounded-2xl p-8 hover-lift">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-4 gradient-text">Train Your Custom Model</h3>
                        <p className="text-high-contrast mb-6">
                          Upload your images and train a custom AI model that learns your unique style and preferences.
                        </p>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center text-high-contrast">
                            <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Upload up to 30 high-quality images
                          </li>
                          <li className="flex items-center text-high-contrast">
                            <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Customize model parameters
                          </li>
                          <li className="flex items-center text-high-contrast">
                            <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Train in minutes
                          </li>
                        </ul>
                        <Link 
                          href="/train" 
                          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium transition-all hover-lift"
                        >
                          Start Training
                          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                          </svg>
                        </Link>
                      </div>
                      <div className="w-full md:w-1/2 aspect-square rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-6 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-24 h-24 text-indigo-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="generate">
                  <div className="mt-6 glass rounded-2xl p-8 hover-lift">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-4 gradient-text">Generate Amazing Images</h3>
                        <p className="text-high-contrast mb-6">
                          Use your trained models to generate unique and creative images with simple text prompts.
                        </p>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center text-high-contrast">
                            <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Choose from your trained models
                          </li>
                          <li className="flex items-center text-high-contrast">
                            <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Write creative prompts
                          </li>
                          <li className="flex items-center text-high-contrast">
                            <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Generate multiple variations
                          </li>
                        </ul>
                        <Link 
                          href="/generate" 
                          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all hover-lift"
                        >
                          Start Generating
                          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                          </svg>
                        </Link>
                      </div>
                      <div className="w-full md:w-1/2 aspect-square rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-6 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-24 h-24 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 mb-6">
                <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-high-contrast">Fast Training</h3>
              <p className="text-high-contrast">
                Train your custom AI model in minutes with our optimized training pipeline.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-0.5 mb-6">
                <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-high-contrast">High Quality</h3>
              <p className="text-high-contrast">
                Generate stunning, high-resolution images that capture your unique style.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 hover-lift md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-red-600 p-0.5 mb-6">
                <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-high-contrast">Style Transfer</h3>
              <p className="text-high-contrast">
                Apply your unique artistic style to any image concept with our advanced AI models.
              </p>
            </div>
          </div>
        </main>
        
        <footer className="max-w-6xl mx-auto mt-16 text-center">
          <div className="py-4 border-t border-indigo-100 dark:border-indigo-900/30">
            <p className="text-high-contrast">SynthLabel - Upload and train your own models</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
