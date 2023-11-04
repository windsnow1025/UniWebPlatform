import axios from 'axios';
import '/public/css/markdown.css';

import { applyTheme } from "../manager/ThemeManager.js";
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

async function init() {
    const filename = new URLSearchParams(window.location.search).get('filename');
    document.title = filename;
    const res = await axios.get('../markdown/' + filename);
    const markdown = res.data;
    const markdown_div = document.querySelector('#markdown-div');
    markdown_div.innerHTML = marked.parse(markdown);
}

await init();