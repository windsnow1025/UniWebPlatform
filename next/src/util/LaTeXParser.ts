import renderMathInElement from "katex/contrib/auto-render";
import 'katex/dist/katex.min.css';

const katex_config = {
  delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: false},
    {left: '\\(', right: '\\)', display: false},
    {left: '\\[', right: '\\]', display: true}
  ],
};


//<div class="markdown-body" contenteditable="plaintext-only"><p>\[
// e^{ix} = \cos(x) + i\sin(x)
// \]</p>
// </div>
export function parseLaTeX(content_div: HTMLElement) {
  renderMathInElement(content_div, katex_config)
}