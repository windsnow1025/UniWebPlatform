await fetch('/html/theme.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('theme').innerHTML = data;
    });

function applyTheme(theme) {
    const body = document.body;

    // Remove all theme classes
    body.classList.remove("light-theme");
    body.classList.remove("dark-theme");

    if (theme === "light") {
        body.classList.add("light-theme");
    } else if (theme === "dark") {
        body.classList.add("dark-theme");
    } else {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            body.classList.add("dark-theme");
        } else {
            body.classList.add("light-theme");
        }
    }

    // Save theme to local storage
    localStorage.setItem("theme", theme);
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
    } else {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            const darkCss = document.createElement('link');
            darkCss.setAttribute('rel', 'stylesheet');
            darkCss.setAttribute('href', '/css/markdown/github-markdown-dark.css');
            document.head.appendChild(darkCss);
        } else {
            const lightCss = document.createElement('link');
            lightCss.setAttribute('rel', 'stylesheet');
            lightCss.setAttribute('href', '/css/markdown/github-markdown-light.css');
            document.head.appendChild(lightCss);
        }
    }

    // Save theme to local storage
    localStorage.setItem("markdownTheme", theme);
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
    } else {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            const darkCss = document.createElement('link');
            darkCss.setAttribute('rel', 'stylesheet');
            darkCss.setAttribute('href', '/css/highlight/github-dark.css');
            document.head.appendChild(darkCss);
        } else {
            const lightCss = document.createElement('link');
            lightCss.setAttribute('rel', 'stylesheet');
            lightCss.setAttribute('href', '/css/highlight/github.css');
            document.head.appendChild(lightCss);
        }
    }

    // Save theme to local storage
    localStorage.setItem("highlightTheme", theme);
}

export function initializeTheme() {

    // Listen for theme change
    const themeSelect = document.getElementById("themeSelect");
    themeSelect.addEventListener("change", (event) => {
        const selectedTheme = event.target.value;
        applyTheme(selectedTheme);
        applyMarkdownTheme(selectedTheme);
        applyHighlightTheme(selectedTheme);
    });

    // Get theme from local storage
    const localStorageTheme = localStorage.getItem("theme");
    const localStorageMarkdownTheme = localStorage.getItem("markdownTheme");
    const localStorageHighlightTheme = localStorage.getItem("highlightTheme");

    // Apply the theme
    applyTheme(localStorageTheme);
    applyMarkdownTheme(localStorageMarkdownTheme);
    applyHighlightTheme(localStorageHighlightTheme);
}