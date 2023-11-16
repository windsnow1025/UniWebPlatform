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

export function parseMarkdown(content) {
    let decodeEntitiesInParsedCode = function(html) {
        return html.replace(/<code([^>]*)>((?:[^<]+|<(?!\/code>))+)<\/code>/g, function(match, p1, p2) {
            return '<code' + p1 + '>' + p2.replace(/&amp;/g, "&") + '</code>';
        });
    }

    const parsedContent = marked.parse(content);
    return decodeEntitiesInParsedCode(parsedContent);
}

import renderMathInElement from "katex/contrib/auto-render";

const katex_config = {
    delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
    ],
};

export function parseLaTeX(content_div) {
    renderMathInElement(content_div, katex_config)
}