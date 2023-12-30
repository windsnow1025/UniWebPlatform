import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';

import renderMathInElement from "katex/contrib/auto-render";
import 'katex/dist/katex.min.css';


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
  // content:
  // &lt;div&gt;&amp;&lt;/div&gt;
  //
  // `&lt;div&gt;&amp;&lt;/div&gt;`
  //
  // ```
  // &lt;div&gt;&amp;&lt;/div&gt;
  // ```
  //
  // ```html
  // &lt;div&gt;&amp;&lt;/div&gt;
  // ```

  const parsedContent = marked.parse(content);
  // parsedContent:
  // <p>&lt;div&gt;&amp;&lt;/div&gt;</p>
  // <p><code>&amp;lt;div&amp;gt;&amp;amp;&amp;lt;/div&amp;gt;</code></p>
  // <pre><code>&amp;lt;div&amp;gt;&amp;amp;&amp;lt;/div&amp;gt;</code></pre>
  // <pre><code class="hljs language-html">
  //   <span class="hljs-symbol">&amp;lt;</span>
  //   div
  //   <span class="hljs-symbol">&amp;gt;</span>
  //   <span class="hljs-symbol">&amp;amp;</span>
  //   <span class="hljs-symbol">&amp;lt;</span>
  //   /div
  //   <span class="hljs-symbol">&amp;gt;</span>
  // </code></pre>

  const decodedContent = decodeEntitiesInParsedCode(parsedContent);
  // decodedContent:
  // <p>&lt;div&gt;&amp;&lt;/div&gt;</p>
  // <p><code>&lt;div&gt;&amp;&lt;/div&gt;</code></p>
  // <pre><code>&lt;div&gt;&amp;&lt;/div&gt;</code></pre>
  // <pre><code class="hljs language-html">
  //   <span class="hljs-symbol">&lt;</span>
  //   div
  //   <span class="hljs-symbol">&gt;</span>
  //   <span class="hljs-symbol">&amp;</span>
  //   <span class="hljs-symbol">&lt;</span>
  //   /div
  //   <span class="hljs-symbol">&gt;</span>
  // </code></pre>

  return decodedContent;
}


const katex_config = {
  delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: false},
    {left: '\(', right: '\)', display: false},
    {left: '\[', right: '\]', display: true}
  ],
};

export function parseLaTeX(content_div) {
  renderMathInElement(content_div, katex_config)
}