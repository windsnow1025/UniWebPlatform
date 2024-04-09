import {createTheme} from "@mui/material/styles";

const convertTheme = (systemTheme) => {
  if (systemTheme !== "system") {
    return systemTheme;
  }
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDarkScheme.matches ? "dark" : "light";
}

export function applyTheme(systemTheme) {
  const theme = convertTheme(systemTheme);
  applyMainTheme(theme);
  applyMarkdownTheme(theme);
  applyHighlightTheme(theme);
}

function applyMainTheme(theme) {
  const body = document.body;

  // Remove all theme classes
  body.classList.remove("light-theme");
  body.classList.remove("dark-theme");

  if (theme === "light") {
    body.classList.add("light-theme");
  } else if (theme === "dark") {
    body.classList.add("dark-theme");
  }
}

function applyMarkdownTheme(theme) {
  // Get all link elements
  const links = document.getElementsByTagName('link');

  // Loop through all link elements
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const href = link.getAttribute('href');

    // If link is for github-markdown-css, remove it
    if (href && href.includes('/markdown/')) {
      link.parentNode.removeChild(link);
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

function applyHighlightTheme(theme) {
  // Get all link elements
  const links = document.getElementsByTagName('link');

  // Loop through all link elements
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const href = link.getAttribute('href');

    // If link is for highlight.js, remove it
    if (href && href.includes('highlight')) {
      link.parentNode.removeChild(link);
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

export function createMUITheme(systemTheme) {
  const theme = convertTheme(systemTheme);
  return createTheme({
    palette: {
      mode: theme,
    }
  });
}
