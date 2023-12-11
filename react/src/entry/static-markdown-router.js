import axios from 'axios';
import '/public/css/markdown.css';

import { applyTheme } from "../manager/ThemeManager.js";
const theme = localStorage.getItem("theme");
applyTheme(theme);

import { parseMarkdown, parseLaTeX } from "../util/MarkdownParser.js";


async function init() {
    const filename = new URLSearchParams(window.location.search).get('filename');
    document.title = filename;
    const res = await axios.get('../markdown/' + filename);
    const markdown = res.data;
    const markdown_div = document.querySelector('#markdown-div');
    markdown_div.innerHTML = parseMarkdown(markdown);
    parseLaTeX(markdown_div);
}

await init();