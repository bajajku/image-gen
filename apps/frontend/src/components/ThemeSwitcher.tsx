"use client"

import React, { useState } from 'react';
import { useTheme, themeOptions, ThemeName } from '@/utils/themeContext';

export const ThemeSwitcher = () => {
  const { currentTheme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="theme-button"
        aria-label="Theme Settings"
      >
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          <span className="hidden sm:inline">Theme</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 glass rounded-xl overflow-hidden z-50 shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="p-3">
            <div className="text-sm font-medium text-high-contrast mb-2">Theme Options</div>
            <div className="space-y-2">
              {themeOptions.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id as ThemeName);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                    currentTheme === theme.id
                      ? 'theme-button active'
                      : 'theme-button'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mr-2" 
                    style={{
                      background: getThemePreviewColor(theme.id as ThemeName)
                    }}
                  ></div>
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 my-3"></div>
            
            <button
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-sm rounded-lg theme-button"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get preview colors for themes
function getThemePreviewColor(themeName: ThemeName): string {
  switch (themeName) {
    case 'default':
      return 'linear-gradient(135deg, #6366f1, #a855f7)';
    case 'indigo':
      return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    case 'purple':
      return 'linear-gradient(135deg, #a855f7, #ec4899)';
    case 'green':
      return 'linear-gradient(135deg, #10b981, #06b6d4)';
    case 'red':
      return 'linear-gradient(135deg, #ef4444, #f97316)';
    case 'dark-indigo':
      return 'linear-gradient(135deg, #818cf8, #a78bfa)';
    case 'nord':
      return 'linear-gradient(135deg, #88c0d0, #b48ead)';
    default:
      return 'linear-gradient(135deg, #6366f1, #a855f7)';
  }
} 