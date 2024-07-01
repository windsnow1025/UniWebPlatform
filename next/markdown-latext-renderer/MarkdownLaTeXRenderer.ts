import {parseMarkdown} from "@/markdown-latext-renderer/MarkdownParser";
import {renderLaTeX} from "@/markdown-latext-renderer/LaTeXRenderer";

export async function parseMarkdownLaTeX(content_div: HTMLElement, content: string, sanitize = true) {
  content_div.innerHTML = await parseMarkdown(content, sanitize);
  renderLaTeX(content_div);
}