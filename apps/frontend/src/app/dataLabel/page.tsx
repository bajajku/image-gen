"use client";
import { Hero } from "@/components/Hero";
import { Upload } from "@/components/Upload";

export default function DataLabelPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Semi-transparent overlay to improve content readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 dark:from-gray-900/90 dark:via-indigo-950/90 dark:to-purple-950/90 -z-10"></div>
      
      <div className="relative z-10">
        <Hero />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="glass rounded-2xl p-8 hover-lift">
            <Upload />
          </div>
        </div>
      </div>
    </div>
  );
}
