import {useEffect, useState} from 'react';
import {createMUITheme, ThemeType} from "../utils/Theme";
import {useMediaQuery} from "@mui/material";

const useThemeHandler = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeType, setThemeType] = useState(ThemeType.Dark);
  const [muiTheme, setMuiTheme] = useState(createMUITheme(themeType, prefersDarkMode));

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || ThemeType.System;
    setThemeType(storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", themeType);
    console.log(themeType)
    setMuiTheme(createMUITheme(themeType, prefersDarkMode));
  }, [prefersDarkMode, themeType]);

  return {
    themeType: themeType,
    setThemeType: setThemeType,
    muiTheme: muiTheme,
  };
};

export default useThemeHandler;