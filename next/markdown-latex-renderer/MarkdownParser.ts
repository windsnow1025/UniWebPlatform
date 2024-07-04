import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';


const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, {language}).value;
    }
  })
);

const addLaTeXEscape = (text: string) => {
  return text
    .replace(/\\\[/g, '\\\\\[')
    .replace(/\\\]/g, '\\\\\]')
    .replace(/\\\(/g, '\\\\\(')
    .replace(/\\\)/g, '\\\\\)');
};

// Order: '&' -> '< >'
export function sanitize(content: string) {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Order: '< >' -> '&'
export function desanitize(content: string) {
  return content
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

const decodeEntitiesInParsedCode = function (text: string) {
  // Use "\S\s" instead of "." to match newlines
  return text.replace(/<code([^>]*?)>([\S\s]*?)<\/code>/g, function (match, p1, p2) {
    return `<code${p1}>${p2.replace(/&amp;/g, "&")}</code>`;
  });
};

export async function parseMarkdown(content: string, sanitize = true) {
  content = addLaTeXEscape(content);
  if (!sanitize) {
    content = desanitize(content);
  }
  content = await marked.parse(content);
  content = decodeEntitiesInParsedCode(content);
  return content;
}
