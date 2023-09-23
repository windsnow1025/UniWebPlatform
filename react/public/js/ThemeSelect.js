import React, { useState, useEffect } from 'react';
import { applyTheme } from './theme.js';

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
