import React, {useState, useRef, useEffect} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import { parseMarkdown, parseLaTeX } from '../util/MarkdownParser';
import { MarkdownLogic } from '../logic/MarkdownLogic';
import '../asset/css/markdown.css';
import AuthDiv from "../component/AuthDiv";
import ThemeSelect from "../component/ThemeSelect";
import {getInitMUITheme} from "../logic/ThemeLogic";

function MarkdownAdd() {
  const [theme, setTheme] = useState(getInitMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
  }, []);

  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const markdownRef = useRef(null);
  const markdownLogic = new MarkdownLogic();

  useEffect(() => {
    document.title = "Markdown Add";
  }, []);

  const handleEdit = () => {
    markdownRef.current.innerHTML = content;
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      const content = markdownRef.current.innerHTML;
      setContent(content);
      markdownRef.current.innerHTML = parseMarkdown(content);
      parseLaTeX(markdownRef.current);
    }
    setIsEditing(false);
  };

  const handleAdd = async () => {
    const title = markdownLogic.getTitleFromContent(content);
    await markdownLogic.addMarkdown(title, content);
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
        {!isEditing && <button onClick={handleEdit}>Edit</button>}
        {isEditing && <button onClick={handleConfirm}>Confirm</button>}
        <button onClick={handleAdd}>Add</button>
      </div>
    </ThemeProvider>
  );
}

export default MarkdownAdd;
