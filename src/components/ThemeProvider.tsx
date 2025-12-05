import React, { createContext, useContext, useEffect, useState } from 'react';

export const themes = [
  {
    id: 'blueOcean',
    name: 'Blue Ocean',
    preview: { light: '#00B4D8', default: '#0077B6', dark: '#03045E' },
  },
  {
    id: 'win11',
    name: 'Windows 11',
    preview: { light: '#5B9BD5', default: '#2D89EF', dark: '#1E4E8C' },
  },
  {
    id: 'kaliLinuxNight',
    name: 'Kali Linux Night',
    preview: { light: '#1A2436', default: '#0B1321', dark: '#3B0F7A' },
  },
  {
    id: 'macOsSunny',
    name: 'MacOS Sunny',
    preview: { light: '#FFECB3', default: '#FFD700', dark: '#FFC107' },
  },
  {
    id: 'draculaPinkSoft',
    name: 'Dracula Pink Soft',
    preview: { light: '#FF92D0', default: '#FF79C6', dark: '#FF5EAB' },
  },
];

type ThemeContextValue = {
  themeId: string;
  themeClass: string;
  setTheme: (id: string) => void;
};

const DEFAULT_THEME = 'blueOcean';

const ThemeContext = createContext<ThemeContextValue>({
  themeId: DEFAULT_THEME,
  themeClass: `theme-${DEFAULT_THEME}`,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(() => {
    try {
      return (localStorage.getItem('theme') as string) || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  // Apply theme class on documentElement so CSS variables are available globally (body inherits them)
  useEffect(() => {
    const className = `theme-${themeId}`;
    const root = document.documentElement;
    // remove any theme- prefixed classes
    Array.from(root.classList)
      .filter((c) => c.startsWith('theme-'))
      .forEach((c) => root.classList.remove(c));
    root.classList.add(className);
    try {
      localStorage.setItem('theme', themeId);
    } catch {}
  }, [themeId]);

  const setTheme = (id: string) => setThemeId(id);

  return (
    <ThemeContext.Provider value={{ themeId, themeClass: `theme-${themeId}`, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);