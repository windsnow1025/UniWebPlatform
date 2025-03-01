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

export function applyTheme(systemTheme: ThemeType, prefersDarkMode: boolean) {
  const theme = convertTheme(systemTheme, prefersDarkMode);
  applyMarkdownTheme(theme);
  applyHighlightTheme(theme);
}

function applyMarkdownTheme(theme: ThemeType.Light | ThemeType.Dark) {
  // Get all link elements
  const links = document.getElementsByTagName('link');

  // Loop through all link elements
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const href = link.getAttribute('href');

    // If link is for github-markdown-css, remove it
    if (href && href.includes('/markdown/')) {
      link.parentNode?.removeChild(link);
    }
  }

  // Add new link element
  if (theme === 'dark') {
    const darkCss = document.createElement('link');
    darkCss.setAttribute('rel', 'stylesheet');
    darkCss.setAttribute('href', '/css/markdown/github-markdown-dark.css');
    document.head.appendChild(darkCss);
  } else if (theme === 'light') {
    const lightCss = document.createElement('link');
    lightCss.setAttribute('rel', 'stylesheet');
    lightCss.setAttribute('href', '/css/markdown/github-markdown-light.css');
    document.head.appendChild(lightCss);
  }
}

function applyHighlightTheme(theme: string) {
  // Get all link elements
  const links = document.getElementsByTagName('link');

  // Loop through all link elements
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const href = link.getAttribute('href');

    // If link is for highlight.js, remove it
    if (href && href.includes('highlight')) {
      link.parentNode?.removeChild(link);
    }
  }

  // Add new link element
  if (theme === 'dark') {
    const darkCss = document.createElement('link');
    darkCss.setAttribute('rel', 'stylesheet');
    darkCss.setAttribute('href', '/css/highlight/github-dark.css');
    document.head.appendChild(darkCss);
  } else if (theme === 'light') {
    const lightCss = document.createElement('link');
    lightCss.setAttribute('rel', 'stylesheet');
    lightCss.setAttribute('href', '/css/highlight/github.css');
    document.head.appendChild(lightCss);
  }
}

export function createMUITheme(systemTheme: ThemeType, prefersDarkMode: boolean) {
  const theme = convertTheme(systemTheme, prefersDarkMode);
  return createTheme({
    palette: {
      mode: theme as ThemeType.Light || ThemeType.Dark,
    }
  });
}
