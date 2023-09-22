// Auth
import {init} from "./auth";

await init();

// Theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeSelect from './ThemeSelect.js';

const theme_div = ReactDOM.createRoot(document.getElementById('theme'));
theme_div.render(
    <React.StrictMode>
        <ThemeSelect />
    </React.StrictMode>
);