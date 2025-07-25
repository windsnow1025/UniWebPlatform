import React, {useEffect, useState} from 'react';
import MarkdownLogic from '../../../lib/markdown/MarkdownLogic';
import {Alert, Button, Snackbar, useTheme} from "@mui/material";
import TextContent from '../../../components/message/content/text/TextContent';
import {RawEditableState} from '../../../lib/common/message/EditableState';

function MarkdownAdd() {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.title = "Markdown Add";
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    setIsEditing(false);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

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
      <div className="local-scroll-scrollable">
        <div className="m-2">
          <TextContent
            content={content}
            setContent={handleContentChange}
            rawEditableState={isEditing ? RawEditableState.AlwaysTrue : RawEditableState.AlwaysFalse}
          />
        </div>
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
