import {createTheme} from "@mui/material/styles";

export enum ThemeType {
  System = "system",
  Light = "light",
  Dark = "dark",
}

function convertTheme(
  systemTheme: ThemeType, prefersDarkMode: boolean
): ThemeType.Light | ThemeType.Dark {
  if (systemTheme === ThemeType.Light || systemTheme === ThemeType.Dark) {
    return systemTheme;
  } else {
    return prefersDarkMode ? ThemeType.Dark : ThemeType.Light;
  }
}

export function createMUITheme(systemTheme: ThemeType, prefersDarkMode: boolean) {
  const theme = convertTheme(systemTheme, prefersDarkMode);
  return createTheme({
    palette: {
      mode: theme as ThemeType.Light | ThemeType.Dark,
    }
  });
}
