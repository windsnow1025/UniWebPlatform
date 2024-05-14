import React, {useEffect, useRef, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {parseMarkdown} from "../../../src/util/MarkdownParser";
import {parseLaTeX} from "../../../src/util/LaTeXParser";
import {MarkdownLogic} from '../../../src/logic/MarkdownLogic';
import {Button, CssBaseline} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

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

  const handleConfirm = async () => {
    if (markdownRef.current) {
      const content = markdownRef.current.innerHTML;
      setContent(content);
      markdownRef.current.innerHTML = await parseMarkdown(content);
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
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <HeaderAppBar
        title="Markdown Add"
        systemTheme={systemTheme}
        setSystemTheme={setSystemTheme}
      />
      <div
        className="markdown-body p-2 min-h-16"
        ref={markdownRef}
        contentEditable={isEditing ? "plaintext-only" : "false"}
      />
      <div className="flex-center">
        {!isEditing &&
          <div className="m-1"><Button variant="contained" color="primary" onClick={handleEdit}>Edit</Button></div>}
        {isEditing &&
          <div className="m-1"><Button variant="contained" color="primary" onClick={handleConfirm}>Confirm</Button>
          </div>}
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

export default Index;
