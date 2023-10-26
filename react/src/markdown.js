import axios from 'axios';
import '/public/css/markdown.css';

import { applyTheme } from "./theme.js";
const theme = localStorage.getItem("theme");
applyTheme(theme);

import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

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