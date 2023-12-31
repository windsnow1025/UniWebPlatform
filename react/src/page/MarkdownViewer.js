import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {applyTheme, getInitMUITheme} from "../logic/ThemeLogic";
import {parseMarkdown} from "../util/MarkdownParser";
import {parseLaTeX} from "../util/LaTeXParser";
import {ThemeProvider} from "@mui/material/styles";

function MarkdownViewer() {
  const [theme, setTheme] = useState(getInitMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
  }, []);

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
    <ThemeProvider theme={theme}>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{padding: 16}}
        dangerouslySetInnerHTML={{__html: parseMarkdown(markdown)}}
      />
    </ThemeProvider>
  );
}

export default MarkdownViewer;
