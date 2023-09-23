import { createContext } from 'react';
import { createTheme } from '@mui/material/styles';
import { convertTheme } from "./theme";

const lightMUITheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const darkMUITheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const systemTheme = localStorage.getItem('theme') || 'system';
const theme = convertTheme(systemTheme);
const initialMuiTheme = theme === 'light' ? lightMUITheme : darkMUITheme;

export const ThemeContext = createContext(initialMuiTheme);