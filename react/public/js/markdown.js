import axios from 'axios';
import { marked } from 'marked';
import hljs from 'highlight.js';
import '../css/markdown.css';

import { applyTheme } from "./theme.js";
const theme = localStorage.getItem("theme");
applyTheme(theme);

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
});

function getFileName() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('filename');
}

function setTitle(filename) {
    document.title = filename;
}

async function parseMarkdown(filename) {
    try {
        const response = await axios.get('../markdown/' + filename);
        return marked.parse(response.data);
    } catch (error) {
        return error;
    }
}

async function process() {
    const filename = getFileName();
    setTitle(filename);
    const markdown = await parseMarkdown(filename);
    const markdown_div = document.getElementById('markdown');
    markdown_div.innerHTML = markdown;
}

await process();