import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { applyTheme } from "../logic/ThemeLogic";
import { parseMarkdown, parseLaTeX } from "../util/MarkdownParser";

function MarkdownViewer() {
  const [markdown, setMarkdown] = useState('');
  const { filename } = useParams();
  const markdownRef = useRef(null);

  useEffect(() => {
    document.title = "Markdown Viewer";
    applyTheme(localStorage.getItem("theme"));

    const fetchMarkdown = async () => {
      const res = await axios.get(`/markdown/${filename}`);
      const markdown = res.data;

      setMarkdown(parseMarkdown(markdown));
      parseLaTeX(markdownRef.current);
    };

    fetchMarkdown();
  }, [filename]);

  return (
    <div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{padding: '16px'}}
        dangerouslySetInnerHTML={{__html: parseMarkdown(markdown)}}
      />
    </div>
  );
}

export default MarkdownViewer;
