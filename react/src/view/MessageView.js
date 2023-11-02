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
        this.role_element = null;
        this.content_div = null;
    }

    init(message_div) {
        this.role_element = message_div.querySelector('[name="role"]');
        this.content_div = message_div.querySelector('div[name="content"]');
    }

    bindRoleChange(handler) {
        this.role_element.addEventListener("change", () => {
            // View -> Model
            if (this.role_element.tagName === "SELECT") {
                handler(this.role_element.value);
            } else {
                handler(this.role_element.innerHTML);
            }

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
        if (role) {
            if (this.role_element.tagName === "SELECT") {
                this.role_element.value = role;
            } else {
                this.role_element.innerHTML = role;
            }
        }
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