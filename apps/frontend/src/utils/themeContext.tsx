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
  // Always start with dark mode enabled
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    // Initialize theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as ThemeName | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    // Check for dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Always default to dark mode, only check saved preference
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    // Apply theme class to body element
    document.body.className = '';
    
    // Add theme class
    if (currentTheme !== 'default') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
    
    // Always add dark mode class, as light mode is removed
    document.body.classList.add('dark');
    
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