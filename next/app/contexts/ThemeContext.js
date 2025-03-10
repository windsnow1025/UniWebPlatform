import React, {createContext, useContext, useEffect, useState} from 'react';
import {convertTheme, createMUITheme, ThemeType} from "../utils/Theme";
import {useMediaQuery} from "@mui/material";

const ThemeContext = createContext();

export const AppThemeProvider = ({children}) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(ThemeType.Dark);
  const [muiTheme, setMuiTheme] = useState(createMUITheme(ThemeType.Dark));
  const [rawTheme, setRawTheme] = useState(ThemeType.Dark);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || ThemeType.System;
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const rawTheme = convertTheme(theme, prefersDarkMode);
    setRawTheme(rawTheme);
    setMuiTheme(createMUITheme(rawTheme));
  }, [prefersDarkMode, theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme, setTheme, rawTheme, muiTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
