import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Selalu default ke 'light' mode (tidak menggunakan prefers-color-scheme)
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark-theme');
    try {
      localStorage.setItem('tbshield_theme', 'light');
      localStorage.removeItem('nutriwise_theme');
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    // Mode gelap dinonaktifkan sesuai kebutuhan desain
  };

  const isDark = false;

  return (
    <ThemeContext.Provider value={{ theme: 'light', isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
