import React, {useState, useRef, useEffect} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {parseMarkdown} from "../util/MarkdownParser";
import {parseLaTeX} from "../util/LaTeXParser";
import { MarkdownLogic } from '../logic/MarkdownLogic';
import '../asset/css/markdown.css';
import AuthDiv from "../component/AuthDiv";
import ThemeSelect from "../component/ThemeSelect";
import {getInitMUITheme} from "../logic/ThemeLogic";
import {Button} from "@mui/material";

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
      <h1 className="center">Markdown Add</h1>
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
        <Button variant="outlined" onClick={handleAdd} style={{margin: 4}}>Add</Button>
      </div>
    </ThemeProvider>
  );
}

export default MarkdownAdd;
