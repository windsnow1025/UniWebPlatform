import '../src/asset/css/index.css';

import React, { useState, useEffect, useRef } from 'react';
import {parseMarkdown} from "../src/util/MarkdownParser";
import {parseLaTeX} from "../src/util/LaTeXParser";
import { MarkdownLogic } from '../src/logic/MarkdownLogic';
import '../src/asset/css/markdown.css';
import AuthDiv from "../app/components/AuthDiv";
import ThemeSelect from "../app/components/ThemeSelect";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {ThemeProvider} from "@mui/material/styles";
import {AppBar, Button, Toolbar} from "@mui/material";
import {useRouter} from "next/router";

function MarkdownUpdate() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const router = useRouter();
  const { id } = router.query;
  const [markdown, setMarkdown] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const markdownRef = useRef(null);
  const markdownLogic = new MarkdownLogic();

  useEffect(() => {

    const fetchMarkdown = async () => {
      const markdown = await markdownLogic.fetchMarkdown(id);
      setMarkdown(markdown);

      document.title = markdown.title;
      markdownRef.current.innerHTML = parseMarkdown(markdown.content);
      parseLaTeX(markdownRef.current);
    };

    if (id) {
      fetchMarkdown();
    }
  }, [id]);

  const handleEdit = () => {
    markdownRef.current.innerHTML = markdown.content;
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      const content = markdownRef.current.innerHTML;
      setMarkdown(prev => ({ ...prev, content: content }));
      markdownRef.current.innerHTML = parseMarkdown(content);
      parseLaTeX(markdownRef.current);
    }
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    const newTitle = markdownLogic.getTitleFromContent(markdown.content);
    setMarkdown(prev => ({ ...prev, title: newTitle }));
    await markdownLogic.updateMarkdown(id, newTitle, markdown.content);
  };

  const handleDelete = async () => {
    await markdownLogic.deleteMarkdown(id);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <h1 className="grow">Markdown Update</h1>
          <div className="m-1"><AuthDiv/></div>
          <div className="m-1"><ThemeSelect/></div>
        </Toolbar>
      </AppBar>
      <div className="m-2">
        <div
          className="markdown-body p-2 min-h-16"
          ref={markdownRef}
          contentEditable={isEditing ? "plaintext-only" : "false"}
        />
      </div>
      <div className="center">
        {!isEditing && <Button variant="outlined" onClick={handleEdit} className="m-1">Edit</Button>}
        {isEditing && <Button variant="outlined" onClick={handleConfirm} className="m-1">Confirm</Button>}
        <Button variant="outlined" onClick={handleUpdate} className="m-1">Update</Button>
        <Button variant="outlined" onClick={handleDelete} className="m-1">Delete</Button>
      </div>
    </ThemeProvider>
  );
}

export default MarkdownUpdate;
