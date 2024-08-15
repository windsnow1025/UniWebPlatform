import {useEffect, useState} from 'react';
import {applyTheme, createMUITheme, ThemeType} from "../utils/Theme";
import {useMediaQuery} from "@mui/material";

const useThemeHandler = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [systemTheme, setSystemTheme] = useState(prefersDarkMode ? ThemeType.Dark : ThemeType.Light);
  const [muiTheme, setMuiTheme] = useState(createMUITheme(systemTheme, prefersDarkMode));

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || ThemeType.System;
    setSystemTheme(storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", systemTheme);
    applyTheme(systemTheme, prefersDarkMode);
    setMuiTheme(createMUITheme(systemTheme, prefersDarkMode));
  }, [systemTheme]);

  return { systemTheme, setSystemTheme, muiTheme };
};

export default useThemeHandler;