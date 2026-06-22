// src/contexts/ThemeContext.jsx
import { useEffect, useState } from 'react';

import { ThemeContext } from './theme-context';

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// `useTheme` is exported from `src/contexts/useTheme.js` to keep this file
// exporting only the provider component for fast-refresh compatibility.
