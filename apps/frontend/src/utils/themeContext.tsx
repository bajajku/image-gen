"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available themes
export type ThemeName = 'default' | 'indigo' | 'purple' | 'green' | 'red' | 'dark-indigo' | 'nord';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'default',
  setTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to 'default'
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Initialize theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as ThemeName | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to body element
    document.body.className = '';
    
    // Add theme class
    if (currentTheme !== 'default') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
    
    // Add dark mode class if enabled
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Save preferences to localStorage
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [currentTheme, isDarkMode]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme data for UI
export const themeOptions = [
  { id: 'default', name: 'Default' },
  { id: 'indigo', name: 'Indigo' },
  { id: 'purple', name: 'Purple' },
  { id: 'green', name: 'Green' },
  { id: 'red', name: 'Red' },
  { id: 'dark-indigo', name: 'Dark Indigo' },
  { id: 'nord', name: 'Nord' },
] as const;