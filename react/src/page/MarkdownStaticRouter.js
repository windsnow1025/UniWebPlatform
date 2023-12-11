import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { applyTheme } from "../manager/ThemeManager";
import { parseMarkdown, parseLaTeX } from "../util/MarkdownParser";

function MarkdownStaticRouter() {
  const [markdown, setMarkdown] = useState('');
  const { filename } = useParams();
  const markdownRef = useRef(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const theme = localStorage.getItem("theme");
        applyTheme(theme);

        const res = await axios.get(`/markdown/${filename}`);
        const markdown = res.data;

        setMarkdown(parseMarkdown(markdown));
        parseLaTeX(markdownRef.current);
      } catch (error) {
        console.error('Error fetching markdown:', error);
      }
    };

    fetchMarkdown();
  }, [filename]);

  return (
    <div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{padding: '16px'}}
        dangerouslySetInnerHTML={{__html: parseMarkdown(markdown)}}>
        {/* Rendered markdown content */}
      </div>
    </div>
  );
}

export default MarkdownStaticRouter;
