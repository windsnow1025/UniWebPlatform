import {marked} from "marked";

export class Message {
    /**
     * Constructor
     * @param {string} role
     * @param {string} content
     * @param {HTMLElement} message_div
     */
    constructor(role, content, message_div) {
        this.role = role;
        this.content = content;
        /** @type {HTMLElement} */
        this.role_select = message_div.querySelector('select[name="role"]');
        /** @type {HTMLElement} */
        this.content_div = message_div.querySelector('div[name="content"]');
        this.bind();
        this.render();
    }

    parse() {
        let content = this.content;
        content = content.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        content = marked.parse(content);
        this.content_div.innerHTML = content;
        MathJax.typeset([this.content_div]);
    }

    render(parse = true) {
        this.role_select.value = this.role;
        this.content_div.innerHTML = this.content;
        if (parse) {
            this.parse();
        }
    }

    bind() {
        // On role change, update role value
        this.role_select.addEventListener("change", function () {
            this.role = this.role_select.value;
        }.bind(this));

        // On content blur, update content value
        this.content_div.addEventListener("blur", function () {
            this.content = this.content_div.innerHTML;
            this.render();
        }.bind(this));

        // On content focus, show unparsed content
        this.content_div.addEventListener("focus", function () {
            this.content_div.innerHTML = this.content;
        }.bind(this));
    }
}