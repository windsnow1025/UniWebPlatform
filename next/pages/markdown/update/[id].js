import React, {useEffect, useRef, useState} from 'react';
import {parseMarkdown} from "../../../src/util/MarkdownParser";
import {parseLaTeX} from "../../../src/util/LaTeXParser";
import {MarkdownLogic} from '../../../src/logic/MarkdownLogic';
import '../../../src/asset/css/markdown.css';
import {ThemeProvider} from "@mui/material/styles";
import {Button, CssBaseline} from "@mui/material";
import {useRouter} from "next/router";
import Snackbar from "@mui/material/Snackbar";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function MarkdownUpdate() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const router = useRouter();
  const {id} = router.query;
  const [markdown, setMarkdown] = useState({title: '', content: ''});
  const [isEditing, setIsEditing] = useState(false);
  const markdownRef = useRef(null);
  const markdownLogic = new MarkdownLogic();

  const fetchMarkdown = async () => {
    const markdown = await markdownLogic.fetchMarkdown(id);
    setMarkdown(markdown);

    document.title = markdown.title;
    markdownRef.current.innerHTML = await parseMarkdown(markdown.content);
    parseLaTeX(markdownRef.current);
  };

  useEffect(() => {
    if (id) {
      fetchMarkdown();
    }
  }, [id]);

  const handleEdit = () => {
    markdownRef.current.innerHTML = markdown.content;
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    if (markdownRef.current) {
      const content = markdownRef.current.innerHTML;
      setMarkdown(prev => ({...prev, content: content}));
      markdownRef.current.innerHTML = await parseMarkdown(content);
      parseLaTeX(markdownRef.current);
    }
    setIsEditing(false);
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleUpdate = async () => {
    const newTitle = markdownLogic.getTitleFromContent(markdown.content);
    setMarkdown(prev => ({...prev, title: newTitle}));
    try {
      await markdownLogic.updateMarkdown(id, newTitle, markdown.content);
      setAlertMessage('Update success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await markdownLogic.deleteMarkdown(id);
      setAlertMessage('Delete success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Markdown Update"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
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
          <div className="m-1"><Button variant="contained" color="secondary" onClick={handleUpdate}>Update</Button></div>
          <div className="m-1"><Button variant="outlined" onClick={handleDelete}>Delete</Button></div>
        </div>
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

export default MarkdownUpdate;
