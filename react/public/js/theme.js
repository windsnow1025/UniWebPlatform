async function setThemeHtml() {
    await fetch('/html/theme.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('theme').innerHTML = data;
        });
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

export function convertTheme(systemTheme) {
    let theme;
    if (systemTheme === "light") {
        theme = "light";
    } else if (systemTheme === "dark") {
        theme = "dark";
    } else {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            theme = "dark";
        } else {
            theme = "light";
        }
    }
    return theme;
}

export function applyTheme(systemTheme) {
    /**
     * Apply the theme to the page
     * @param {string} theme - system / light / dark
     * @returns {void}
     */
    const theme = convertTheme(systemTheme);
    applyMainTheme(theme);
    applyMarkdownTheme(theme);
    applyHighlightTheme(theme);
    localStorage.setItem("theme", theme);
}

export async function initializeTheme() {
    // Add theme html
    await setThemeHtml();

    // Listen for theme change
    const themeSelect = document.getElementById("themeSelect");
    themeSelect.addEventListener("change", (event) => {
        const selectedTheme = event.target.value;
        applyTheme(selectedTheme);
    });

    // Get theme from local storage
    const localStorageTheme = localStorage.getItem("theme");

    // Convert theme
    const theme = convertTheme(localStorageTheme);

    // Apply the theme
    applyTheme(theme);
}

import {createTheme} from "@mui/material/styles";
export function applyMUITheme(theme) {
    return createTheme({
        palette: {
            mode: theme,
        },
    });
}