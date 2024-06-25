import { parseMarkdown } from "./MarkdownParser";
import { describe, expect, test } from "@jest/globals";

describe('parseMarkdown', () => {
  const testCases = [
    // <div>&</div>
    {
      description: 'should parse plain text correctly',
      input: '&lt;div&gt;&amp;&lt;/div&gt;',
      expectedOutput: '<p>&lt;div&gt;&amp;&lt;/div&gt;</p>\n'
    },
    // `<div>&</div>`
    {
      description: 'should parse inline code correctly',
      input: '`&lt;div&gt;&amp;&lt;/div&gt;`',
      expectedOutput: '<p><code>&lt;div&gt;&amp;&lt;/div&gt;</code></p>\n'
    },
    // ```
    // <div>&</div>
    // ```
    {
      description: 'should parse code block correctly',
      input: '```\n&lt;div&gt;&amp;&lt;/div&gt;\n```',
      expectedOutput: '<pre><code>&lt;div&gt;&amp;&lt;/div&gt;\n</code></pre>'
    },
    // ```html
    // <div>&</div>
    // ```
    {
      description: 'should parse HTML code block correctly',
      input: '```html\n&lt;div&gt;&amp;&lt;/div&gt;\n```',
      expectedOutput: '<pre><code class="hljs language-html"><span class="hljs-symbol">&lt;</span>div<span class="hljs-symbol">&gt;</span><span class="hljs-symbol">&amp;</span><span class="hljs-symbol">&lt;</span>/div<span class="hljs-symbol">&gt;</span>\n</code></pre>'
    },
    // <div>&amp;</div>
    {
      description: 'should parse plain text with special characters correctly',
      input: '&lt;div&gt;&amp;amp;&lt;/div&gt;',
      expectedOutput: '<p>&lt;div&gt;&amp;amp;&lt;/div&gt;</p>\n'
    },
    // `<div>&amp;</div>`
    {
      description: 'should parse inline code with special characters correctly',
      input: '`&lt;div&gt;&amp;amp;&lt;/div&gt;`',
      expectedOutput: '<p><code>&lt;div&gt;&amp;amp;&lt;/div&gt;</code></p>\n'
    },
    // ```
    // <div>&lt;&amp;&gt;</div>
    // ```
    {
      description: 'should parse code block with special characters correctly',
      input: '```\n&lt;div&gt;&amp;lt;&amp;amp;&amp;gt;&lt;/div&gt;\n```',
      expectedOutput: '<pre><code>&lt;div&gt;&amp;lt;&amp;amp;&amp;gt;&lt;/div&gt;\n</code></pre>'
    },
    // ```html
    // <div>&lt;&amp;&gt;</div>
    // ```
    {
      description: 'should parse HTML code block with special characters correctly',
      input: '```html\n&lt;div&gt;&amp;lt;&amp;amp;&amp;gt;&lt;/div&gt;\n```',
      expectedOutput: '<pre><code class="hljs language-html"><span class="hljs-symbol">&lt;</span>div<span class="hljs-symbol">&gt;</span><span class="hljs-symbol">&amp;</span>lt;<span class="hljs-symbol">&amp;</span>amp;<span class="hljs-symbol">&amp;</span>gt;<span class="hljs-symbol">&lt;</span>/div<span class="hljs-symbol">&gt;</span>\n</code></pre>'
    }
  ];

  test.each(testCases)('$description', async ({ input, expectedOutput }) => {
    const output = await parseMarkdown(input);
    expect(output).toBe(expectedOutput);
  });
});