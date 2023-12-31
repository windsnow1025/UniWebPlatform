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


export function parseMarkdown(content) {
  const decodeEntitiesInParsedCode = function (html: string) {
    // Use "\S\s" instead of "." to match newlines
    return html.replace(/<code([^>]*?)>([\S\s]*?)<\/code>/g, function (match, p1, p2) {
      return `<code${p1}>${p2.replace(/&amp;/g, "&")}</code>`;
    });
  };

  const parsedContent = marked.parse(content);
  const decodedContent = decodeEntitiesInParsedCode(parsedContent);
  
  return decodedContent;
}
