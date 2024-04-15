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


export async function parseMarkdown(content: string, sanitize = true) {
  if (sanitize) {
    const addLaTeXEscape = (text: string) => {
      return text
        .replace(/\\\[/g, '\\\\\[')
        .replace(/\\\]/g, '\\\\\]')
        .replace(/\\\(/g, '\\\\\(')
        .replace(/\\\)/g, '\\\\\)');
    };
    const escapedContent = addLaTeXEscape(content);
    const decodeEntitiesInParsedCode = function (text: string) {
      // Use "\S\s" instead of "." to match newlines
      return text.replace(/<code([^>]*?)>([\S\s]*?)<\/code>/g, function (match, p1, p2) {
        return `<code${p1}>${p2.replace(/&amp;/g, "&")}</code>`;
      });
    };

    const parsedContent = await marked.parse(escapedContent);
    const decodedContent = decodeEntitiesInParsedCode(parsedContent);
    return decodedContent;
  } else {
    const deSanitize = function (text: string) {
      const deSanitizeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
      };
      return text.replace(
        /&amp;|&lt;|&gt;|&quot;|&#039;/g,
        (matchedEntity) => {
          return deSanitizeMap[matchedEntity as keyof typeof deSanitizeMap];
        });
    }

    const deSanitizedContent = deSanitize(content);
    const parsedContent = marked.parse(deSanitizedContent);
    return parsedContent;
  }
}
