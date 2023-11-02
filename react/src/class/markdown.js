import axios from 'axios';

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


export class Markdown {
    constructor(id, markdown_div) {
        this.id = id;
        this.title = "";
        this.content = "";
        this.markdown_div = markdown_div;
        this.token = localStorage.getItem('token');
    }

    parseMarkdown() {
        return marked.parse(this.content);
    }

    async init() {
        await this.fetchMarkdown();
        document.title = this.title;
        this.markdown_div.innerHTML = this.parseMarkdown();
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

    async addMarkdown() {
        this.get_title_from_content();
        try {
            await axios.post('/api/markdown/', {
                data: {
                    title: this.title,
                    content: this.content
                }
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            alert('Add Success!')
        } catch (error) {
            console.error(error);
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
            alert('Update Success!')
        } catch (error) {
            console.error(error);
        }
    }

    get_title_from_content() {
        this.title = this.content.split('\n')[0].replace('# ', '');
    }
}