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

export function parseLaTeX(content_div) {
  renderMathInElement(content_div, katex_config)
}