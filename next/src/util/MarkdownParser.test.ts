import {parseMarkdown} from "./MarkdownParser";
import {describe, it, expect} from "@jest/globals";

describe('parseMarkdown', () => {
  it('should parse plain text correctly', async () => {
    const input = '&lt;div&gt;&amp;&lt;/div&gt;';
    const output = await parseMarkdown(input);
    const expectedOutput = '<p>&lt;div&gt;&amp;&lt;/div&gt;</p>\n';
    expect(output).toBe(expectedOutput);
  });

  it('should parse inline code correctly', async () => {
    const input = '`&lt;div&gt;&amp;&lt;/div&gt;`';
    const output = await parseMarkdown(input);
    const expectedOutput = '<p><code>&lt;div&gt;&amp;&lt;/div&gt;</code></p>\n';
    expect(output).toBe(expectedOutput);
  });

  it('should parse code block correctly', async () => {
    const input = '```\n&lt;div&gt;&amp;&lt;/div&gt;\n```';
    const output = await parseMarkdown(input);
    const expectedOutput = '<pre><code>&lt;div&gt;&amp;&lt;/div&gt;\n</code></pre>';
    expect(output).toBe(expectedOutput);
  });

  it('should parse HTML code block correctly', async () => {
    const input = '```html\n&lt;div&gt;&amp;&lt;/div&gt;\n```';
    const output = await parseMarkdown(input);
    const expectedOutput = '<pre><code class="hljs language-html"><span class="hljs-symbol">&lt;</span>div<span class="hljs-symbol">&gt;</span><span class="hljs-symbol">&amp;</span><span class="hljs-symbol">&lt;</span>/div<span class="hljs-symbol">&gt;</span>\n</code></pre>';
    expect(output).toBe(expectedOutput);
  });
});
