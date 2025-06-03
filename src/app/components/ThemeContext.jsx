'use client';
import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  // Default to dark theme
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for theme preference in localStorage, default to dark
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      setTheme(savedTheme);
      
      // Apply the theme class to document
      document.documentElement.classList.toggle('light-mode', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Toggle light-mode class instead of using Tailwind's dark class
      document.documentElement.classList.toggle('light-mode', newTheme === 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}