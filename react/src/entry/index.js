// Auth
import {initAuth} from "../manager/AuthManager";

await initAuth();

// Theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeSelect from '../component/ThemeSelect.js';

const theme_div = ReactDOM.createRoot(document.getElementById('theme'));
theme_div.render(
    <React.StrictMode>
        <ThemeSelect />
    </React.StrictMode>
);

// Markdown List
import axios from "axios";
const markdown_list = document.querySelector('#markdown-list');
const res = await axios.get('/api/markdown/');
const data = res.data;
data.forEach(markdown => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `/html/markdown-update.html?id=${markdown.id}`;
    a.innerText = markdown.title;
    li.appendChild(a);
    markdown_list.appendChild(li);
});