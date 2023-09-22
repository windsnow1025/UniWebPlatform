import React, { useState, useEffect } from 'react';

const ThemeSelect = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleThemeChange = (event) => {
        const newTheme = event.target.value;
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);

        // Dispatch custom event
        const themeChangeEvent = new Event('themeChanged');
        window.dispatchEvent(themeChangeEvent);
    };

    const applyTheme = (systemTheme) => {
        localStorage.setItem("theme", systemTheme);
        const theme = convertTheme(systemTheme);
        applyMainTheme(theme);
        applyMarkdownTheme(theme);
        applyHighlightTheme(theme);
    };

    const convertTheme = (systemTheme) => {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (systemTheme !== "system") {
            return systemTheme;
        }
        if (prefersDarkScheme.matches) {
            return "dark";
        } else if (!prefersDarkScheme.matches) {
            return "light";
        }
    }

    const applyMainTheme = (theme) => {
        const body = document.body;

        // Remove all theme classes
        body.classList.remove("light-theme");
        body.classList.remove("dark-theme");

        if (theme === "light") {
            body.classList.add("light-theme");
        } else if (theme === "dark") {
            body.classList.add("dark-theme");
        }
    };

    const applyMarkdownTheme = (theme) => {
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
    };

    const applyHighlightTheme = (theme) => {
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
    };

    return (
        <div>
            <label htmlFor="theme-select">Theme:</label>
            <select id="theme-select" value={theme} onChange={handleThemeChange}>
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    );
};

export default ThemeSelect;

