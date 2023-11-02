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


class Markdown {
    constructor(markdown_div) {
        this.id = new URLSearchParams(window.location.search).get('id');
        this.title = "";
        this.content = "";
        this.markdown_div = markdown_div;
        this.token = localStorage.getItem('token');
    }

    async init() {
        await this.fetchMarkdown();
        document.title = this.title;
        this.markdown_div.innerHTML = marked.parse(this.content);
    }

    async fetchMarkdown() {
        try {
            const res = await axios.get('/api/markdown/' + this.id);
            const data = res.data;
            this.title = data.title;
            this.content = data.content;
        } catch (error) {
            return error;
        }
    }

    async updateMarkdown() {
        this.get_title_from_content();
        try {
            await axios.put('/api/markdown/', {
                data: {
                    id: this.id,
                    title: this.title,
                    content: this.content
                }
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    get_title_from_content() {
        this.title = this.content.split('\n')[0].replace('# ', '');
    }
}

const markdown_div = document.querySelector('#markdown-div');

const markdown = new Markdown(markdown_div);
await markdown.init();

const edit_button = document.querySelector('#edit-button');
const confirm_button = document.querySelector('#confirm-button');
const update_button = document.querySelector('#update-button');

edit_button.addEventListener('click', () => {
    markdown_div.innerHTML = markdown.content;

    markdown_div.contentEditable = "plaintext-only";
    edit_button.classList.add('hide');
    confirm_button.classList.remove('hide');
});
confirm_button.addEventListener('click', () => {
    markdown.content = markdown_div.innerHTML;
    markdown_div.innerHTML = marked.parse(markdown.content);

    markdown_div.contentEditable = false;
    edit_button.classList.remove('hide');
    confirm_button.classList.add('hide');
});
update_button.addEventListener('click', async () => {
    await markdown.updateMarkdown();
});