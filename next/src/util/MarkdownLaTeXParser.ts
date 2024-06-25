import {parseMarkdown} from "@/src/util/MarkdownParser";
import {parseLaTeX} from "@/src/util/LaTeXParser";

export async function parseMarkdownLaTeX(content_div: HTMLElement, content: string, sanitize = true) {
  content_div.innerHTML = await parseMarkdown(content, sanitize);
  parseLaTeX(content_div);
}