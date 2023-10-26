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

import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render';

const katex_config = {
    delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
    ],
};

export class MessageView {
    constructor() {
        this.role_select = null;
        this.content_div = null;
    }

    init(message_div) {
        this.role_select = message_div.querySelector('select[name="role"]');
        this.content_div = message_div.querySelector('div[name="content"]');
    }

    bindRoleChange(handler) {
        this.role_select.addEventListener("change", () => {
            // View -> Model
            handler(this.role_select.value);
        });
    }

    bindContentFocus(handler) {
        this.content_div.addEventListener("focus", () => {
            // Model -> View
            handler();
        });
    }

    bindContentBlur(handler) {
        this.content_div.addEventListener("blur", () => {
            // View -> Model
            handler(this.content_div.innerHTML);
        });
    }

    parseContent(content) {
        let parsedContent = content.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        return marked.parse(parsedContent);
    }

    render({ role, content, parseContent = true } = {}) {
        if (role) this.role_select.value = role;
        if (content) {
            if (!parseContent) {
                this.content_div.innerHTML = content;
            } else {
                this.content_div.innerHTML = this.parseContent(content);
                renderMathInElement(this.content_div, katex_config);
            }
        }
    }
}
