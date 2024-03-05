import { useState, useEffect } from 'react';
import {lightMUITheme} from "../../src/logic/ThemeLogic";

export const useTheme = () => {
  const [theme, setTheme] = useState(lightMUITheme);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  return theme;
};