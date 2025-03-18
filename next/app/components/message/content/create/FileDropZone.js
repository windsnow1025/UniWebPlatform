import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import { Alert, Paper, Snackbar, Typography, useTheme } from '@mui/material';
import FileLogic from "../../../../../src/common/file/FileLogic";

function FileDropZone({ setFiles }) {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const dragCounter = useRef(0);
  const fileLogic = useMemo(() => new FileLogic(), []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      try {
        const filesArray = Array.from(files);
        const uploadedUrls = await fileLogic.uploadFiles(filesArray);
        setFiles(uploadedUrls);

        setAlertMessage("Files uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        setAlertMessage(error.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  }, [setFiles, fileLogic]);

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
        setFiles(uploadedUrls);

        setAlertMessage("Files pasted and uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        setAlertMessage(error.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  }, [setFiles, fileLogic]);

  useEffect(() => {
    return () => {
      dragCounter.current = 0;
    };
  }, []);

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
            ? `1px dashed ${theme.palette.primary.main}`
            : `1px dashed ${theme.palette.divider}`,
          backgroundColor: isDragging
            ? `${theme.palette.primary.light}20`
            : theme.palette.background.paper,
          textAlign: 'center',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'border 0.2s ease, background-color 0.2s ease',
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