import React, { useState, useEffect } from 'react';
import { applyTheme } from '../theme.js';

const ThemeSelect = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleThemeChange = (event) => {
        const theme = event.target.value;
        setTheme(theme);
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