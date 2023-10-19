import { marked } from "marked";
import hljs from "highlight.js";

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, {language}).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
});

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
                MathJax.typeset([this.content_div]); // Assuming MathJax is globally available
            }
        }
    }
}
