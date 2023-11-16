import {parseMarkdown, parseLaTeX} from "../util/MarkdownParser";
import 'katex/dist/katex.min.css';


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
                this.content_div.innerHTML = parseMarkdown(content);
                parseLaTeX(this.content_div);
            }
        }
    }
}
