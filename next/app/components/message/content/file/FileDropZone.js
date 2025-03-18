import React, { useCallback, useState, useEffect } from 'react';
import { Alert, Paper, Snackbar, Typography, useTheme } from '@mui/material';
import FileLogic from "../../../../../src/common/file/FileLogic";

function FileDropZone({ setFile }) {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const fileLogic = new FileLogic();

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      try {
        const filesArray = Array.from(files);
        const uploadedUrls = await fileLogic.uploadFiles(filesArray);
        setFile(uploadedUrls); // Pass all uploaded URLs

        setAlertMessage("Files uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        setAlertMessage(error.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  }, [setFile, fileLogic]);

  const handlePaste = useCallback(async (e) => {
    const items = (e.clipboardData || window.clipboardData).items;
    const filesToUpload = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        filesToUpload.push(file);
      }
    }

    if (filesToUpload.length > 0) {
      try {
        const uploadedUrls = await fileLogic.uploadFiles(filesToUpload);
        setFile(uploadedUrls);

        setAlertMessage("Files pasted and uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        setAlertMessage(error.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  }, [setFile, fileLogic]);

  // Add paste event listener to the document
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <>
      <Paper
        elevation={isDragging ? 3 : 1}
        sx={{
          p: 1,
          border: isDragging
            ? `2px dashed ${theme.palette.primary.main}`
            : `1px dashed ${theme.palette.divider}`,
          backgroundColor: isDragging
            ? theme.palette.primary.light + '20' // 20 is for 12% opacity in hex
            : theme.palette.background.paper,
          textAlign: 'center',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          transition: theme.transitions.create(['border', 'background-color'], {
            duration: theme.transitions.duration.standard,
          }),
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        className="focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <Typography
          variant="caption"
          color={isDragging ? "primary" : "textSecondary"}
        >
          Drag & Drop files Paste Files from clipboard
        </Typography>
      </Paper>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FileDropZone;