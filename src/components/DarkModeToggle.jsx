import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  // Initialize state with a function to check localStorage immediately
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      
      // Fall back to system preference if no saved theme
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      // If localStorage is not available, fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Apply theme to document on mount and when isDarkMode changes
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors font-medium text-sm border border-gray-200 dark:border-gray-600"
    >
      {isDarkMode ? '🌙 Dark' : '🌞 Light'}
    </button>
  );
};

export default DarkModeToggle;