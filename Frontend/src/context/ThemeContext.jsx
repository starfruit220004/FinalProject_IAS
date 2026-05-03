import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // We use null to represent "follow system theme" if nothing is in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme'); // 'light', 'dark', or null
  });

  // Calculate the actual active theme (resolvedTheme)
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (theme) return theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update resolvedTheme when state or system changes
  useEffect(() => {
    if (theme) {
      setResolvedTheme(theme);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e) => {
        if (!localStorage.getItem('theme')) {
          setResolvedTheme(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  // Optional: Add a reset to system theme function if desired
  const resetToSystem = () => {
    localStorage.removeItem('theme');
    setTheme(null);
  };

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, isManual: !!theme, toggleTheme, resetToSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
