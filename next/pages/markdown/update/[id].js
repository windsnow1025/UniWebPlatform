import React, {useEffect, useState} from 'react';
import MarkdownLogic from '../../../lib/markdown/MarkdownLogic';
import {Alert, Button, Snackbar, useTheme} from "@mui/material";
import {useRouter} from "next/router";
import TextContent from '../../../components/message/content/text/TextContent';
import {RawEditableState} from '../../../lib/common/message/EditableState';
import Head from "next/head";

function MarkdownUpdate() {
  const router = useRouter();
  const {id} = router.query;
  const [markdown, setMarkdown] = useState({title: '', content: ''});
  const [isEditing, setIsEditing] = useState(false);
  const markdownLogic = new MarkdownLogic();

  const fetchMarkdown = async () => {
    const markdown = await markdownLogic.fetchMarkdown(id);
    setMarkdown(markdown);
  };

  useEffect(() => {
    if (id) {
      fetchMarkdown();
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    setIsEditing(false);
  };

  const handleContentChange = (newContent) => {
    setMarkdown(prev => ({...prev, content: newContent}));
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleUpdate = async () => {
    const newTitle = markdownLogic.getTitleFromContent(markdown.content);
    setMarkdown(prev => ({...prev, title: newTitle}));
    try {
      await markdownLogic.updateMarkdown(id, newTitle, markdown.content);
      setAlertMessage('Update success');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await markdownLogic.deleteMarkdown(id);
      setAlertMessage('Delete success');
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
      <Head>
        <title>{markdown.title} - Windsnow1025</title>
      </Head>
      <div className="local-scroll-scrollable ">
        <div className="m-2">
          <TextContent
            content={markdown.content}
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
        <div className="m-1"><Button variant="contained" color="secondary" onClick={handleUpdate}>Update</Button>
        </div>
        <div className="m-1"><Button variant="outlined" onClick={handleDelete}>Delete</Button></div>
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

export default MarkdownUpdate;
