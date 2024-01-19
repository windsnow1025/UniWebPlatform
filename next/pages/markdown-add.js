import '../src/asset/css/index.css';
import '../src/asset/css/markdown.css';

import React, {useState, useRef, useEffect} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {parseMarkdown} from "../src/util/MarkdownParser";
import {parseLaTeX} from "../src/util/LaTeXParser";
import {MarkdownLogic} from '../src/logic/MarkdownLogic';
import AuthDiv from "../app/components/AuthDiv";
import ThemeSelect from "../app/components/ThemeSelect";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {AppBar, Button, Toolbar} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

function MarkdownAdd() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
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

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleAdd = async () => {
    const title = markdownLogic.getTitleFromContent(content);
    try {
      await markdownLogic.addMarkdown(title, content);
      setAlertMessage('Add success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <div className="Flex-space-around p-2">
          <h1 className="grow">Markdown Add</h1>
          <div className="m-1"><AuthDiv/></div>
          <div className="m-1"><ThemeSelect/></div>
        </div>
      </AppBar>
      <div
        className="markdown-body p-2 min-h-16"
        ref={markdownRef}
        contentEditable={isEditing ? "plaintext-only" : "false"}
      />
      <div className="Flex-Center">
        {!isEditing && <div className="m-1"><Button variant="contained" color="primary" onClick={handleEdit}>Edit</Button></div>}
        {isEditing && <div className="m-1"><Button variant="contained" color="primary" onClick={handleConfirm}>Confirm</Button></div>}
        <div className="m-1"><Button variant="contained" color="secondary" onClick={handleAdd}>Add</Button></div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </ThemeProvider>
  );
}

export default MarkdownAdd;
