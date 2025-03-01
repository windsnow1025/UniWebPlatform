import {useEffect, useState} from 'react';
import {applyTheme, createMUITheme, ThemeType} from "../utils/Theme";
import {useMediaQuery} from "@mui/material";

const useThemeHandler = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeType, setThemeType] = useState(prefersDarkMode ? ThemeType.Dark : ThemeType.Light);
  const [muiTheme, setMuiTheme] = useState(createMUITheme(themeType, prefersDarkMode));

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || ThemeType.System;
    setThemeType(storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", themeType);
    applyTheme(themeType, prefersDarkMode);
    setMuiTheme(createMUITheme(themeType, prefersDarkMode));
  }, [themeType]);

  return {
    themeType: themeType,
    setThemeType: setThemeType,
    muiTheme: muiTheme,
  };
};

export default useThemeHandler;