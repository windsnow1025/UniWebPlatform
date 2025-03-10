import {createTheme} from "@mui/material/styles";

export enum ThemeType {
  System = "system",
  Light = "light",
  Dark = "dark",
}

export function convertTheme(
  systemTheme: ThemeType, prefersDarkMode: boolean
): ThemeType.Light | ThemeType.Dark {
  if (systemTheme === ThemeType.Light || systemTheme === ThemeType.Dark) {
    return systemTheme;
  } else {
    return prefersDarkMode ? ThemeType.Dark : ThemeType.Light;
  }
}

export function createMUITheme(rawTheme: ThemeType) {
  return createTheme({
    palette: {
      mode: rawTheme as ThemeType.Light | ThemeType.Dark,
    }
  });
}
