import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/utils/themeContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Create stunning AI-generated images with custom trained models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
            <header className="glass sticky top-0 z-50">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-3 group hover-lift">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg group-hover:shadow-indigo-500/25 transition-all">
                      <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="font-bold text-xl gradient-text">AI Image Gen</span>
                  </Link>
                  
                  <div className="flex items-center space-x-3">
                    <nav className="flex items-center space-x-1">
                      <Link 
                        href="/train" 
                        className="px-4 py-2 rounded-lg text-high-contrast hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-medium transition-all hover-lift"
                      >
                        Train
                      </Link>
                      <Link 
                        href="/generate" 
                        className="px-4 py-2 rounded-lg text-high-contrast hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-medium transition-all hover-lift"
                      >
                        Generate
                      </Link>
                    </nav>
                    
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-grow">
              {children}
            </main>

            <footer className="glass mt-auto">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-md bg-white dark:bg-gray-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm text-high-contrast">AI Image Generator</span>
                  </div>
                  <p className="text-sm text-high-contrast">Create stunning AI-generated images with custom trained models</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
