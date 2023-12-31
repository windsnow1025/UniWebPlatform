import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {parseMarkdown} from "../util/MarkdownParser";
import {parseLaTeX} from "../util/LaTeXParser";
import { MarkdownLogic } from '../logic/MarkdownLogic';
import '../asset/css/markdown.css';
import AuthDiv from "../component/AuthDiv";
import ThemeSelect from "../component/ThemeSelect";
import {getInitMUITheme} from "../logic/ThemeLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Button} from "@mui/material";

function MarkdownUpdate() {
  const [theme, setTheme] = useState(getInitMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
  }, []);

  const [markdown, setMarkdown] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const markdownRef = useRef(null);
  const markdownLogic = new MarkdownLogic();

  useEffect(() => {

    const fetchMarkdown = async () => {
      const markdown = await markdownLogic.fetchMarkdown(id);
      setMarkdown({
        title: markdown.title,
        content: markdown.content
      });

      document.title = markdown.title;
      markdownRef.current.innerHTML = parseMarkdown(markdown.content);
      parseLaTeX(markdownRef.current);
    };

    fetchMarkdown();
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
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{ margin: 8, padding: 8, minHeight: 24 }}
        contentEditable={isEditing ? "plaintext-only" : "false"}
      />
      <div className="center">
        {!isEditing && <Button variant="outlined" onClick={handleEdit} style={{margin: 4}}>Edit</Button>}
        {isEditing && <Button variant="outlined" onClick={handleConfirm} style={{margin: 4}}>Confirm</Button>}
        <Button variant="outlined" onClick={handleUpdate} style={{margin: 4}}>Update</Button>
        <Button variant="outlined" onClick={handleDelete} style={{margin: 4}}>Delete</Button>
      </div>
    </ThemeProvider>
  );
}

export default MarkdownUpdate;
