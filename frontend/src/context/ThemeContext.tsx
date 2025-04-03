import { useState, useMemo, ReactNode } from 'react';
import { ThemeProvider as MaterialTailwindThemeProvider } from '@material-tailwind/react';
import { ThemeContext } from './ThemeContextDefinition';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  // Apply dark mode class to html element
  useMemo(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const materialTailwindTheme = {
    // You can customize Material Tailwind theme here
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <MaterialTailwindThemeProvider value={materialTailwindTheme}>{children}</MaterialTailwindThemeProvider>
    </ThemeContext.Provider>
  );
};
