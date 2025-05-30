import React, {useEffect, useRef, useState} from 'react';
import MarkdownLogic from '../../../lib/markdown/MarkdownLogic';
import {Alert, Button, Snackbar, useTheme} from "@mui/material";
import {applyTheme, parseMarkdownLaTeX} from "markdown-latex-renderer";

function MarkdownAdd() {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const markdownRef = useRef(null);

  const theme = useTheme();
  const mode = theme.palette.mode;

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

      parseMarkdownLaTeX(markdownRef.current, content);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleAdd = async () => {
    const markdownLogic = new MarkdownLogic();
    const title = markdownLogic.getTitleFromContent(content);
    try {
      await markdownLogic.addMarkdown(title, content);
      setAlertMessage('Add success');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <div className="local-scroll-container">
      
      <div className="local-scroll-scrollable m-2">
        <div
          className="markdown-body p-2 min-h-16"
          ref={markdownRef}
          contentEditable={isEditing ? "plaintext-only" : "false"}
        />
      </div>
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
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MarkdownAdd;