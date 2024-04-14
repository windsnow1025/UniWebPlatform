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


export function parseMarkdown(content, sanitize=true) {
  if (sanitize) {
    const addLaTeXEscape = (text) => {
      return text
        .replace(/\\\[/g, '\\\\\[')
        .replace(/\\\]/g, '\\\\\]')
        .replace(/\\\(/g, '\\\\\(')
        .replace(/\\\)/g, '\\\\\)');
    };
    const escapedContent = addLaTeXEscape(content);
    const decodeEntitiesInParsedCode = function (html) {
      // Use "\S\s" instead of "." to match newlines
      return html.replace(/<code([^>]*?)>([\S\s]*?)<\/code>/g, function (match, p1, p2) {
        return `<code${p1}>${p2.replace(/&amp;/g, "&")}</code>`;
      });
    };

    const parsedContent = marked.parse(escapedContent);
    const decodedContent = decodeEntitiesInParsedCode(parsedContent);
    return decodedContent;
  } else {
    const deSanitize = function (html) {
      const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
      };
      return html.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) { return map[m]; });
    }

    const deSanitizedContent = deSanitize(content);
    const parsedContent = marked.parse(deSanitizedContent);
    return parsedContent;
  }
}
