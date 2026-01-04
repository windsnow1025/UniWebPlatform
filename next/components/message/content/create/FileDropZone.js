import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Paper, Snackbar, Typography, useTheme } from '@mui/material';
import FileLogic from "../../../../lib/common/file/FileLogic";
import useScreenSize from "../../../common/hooks/useScreenSize";

function FileDropZone({ setFiles, isUploading, setIsUploading }) {
  const theme = useTheme();
  const screenSize = useScreenSize();
  const smallScreen = screenSize === 'xs';

  const [isDragging, setIsDragging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const dragCounter = useRef(0);
  const dropzoneRef = useRef(null);
  const fileLogic = useMemo(() => new FileLogic(), []);

  const [isFocused, setIsFocused] = useState(false);

  const traverseFileTree = (item, path = "") => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file) => {
          file.relativePath = path + file.name;
          resolve([file]);
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries) => {
          let files = [];
          for (const entry of entries) {
            files = files.concat(await traverseFileTree(entry, path + item.name + "/"));
          }
          resolve(files);
        });
      }
    });
  };

  const getAllFiles = async (items) => {
    let allFiles = [];

    const filePromises = [];
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry?.();
      if (entry) {
        filePromises.push(traverseFileTree(entry));
      }
    }

    const filesArrays = await Promise.all(filePromises);
    for (const filesArray of filesArrays) {
      allFiles = allFiles.concat(filesArray);
    }

    return allFiles;
  };

  const handleDragEnter = useCallback((e) => {
    if (isUploading) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  }, [isUploading]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    if (isUploading) return;
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging, isUploading]);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (isUploading) return;

    let filesToUpload;
    const items = e.dataTransfer.items;
    if (items && items.length && items[0].webkitGetAsEntry) {
      filesToUpload = await getAllFiles(items);
    } else {
      filesToUpload = Array.from(e.dataTransfer.files);
    }

    if (filesToUpload.length > 0) {
      setIsUploading(true);
      try {
        const uploadedUrls = await fileLogic.uploadFiles(filesToUpload);
        setFiles(uploadedUrls);

        setAlertMessage("Files uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setIsUploading(false);
      }
    }
  }, [setFiles, fileLogic, isUploading, setIsUploading]);

  const handlePaste = useCallback(async (e) => {
    if (isUploading) return;

    if (!dropzoneRef.current.contains(document.activeElement) &&
      !dropzoneRef.current.contains(e.target)) {
      return;
    }

    const items = (e.clipboardData || window.clipboardData).items;
    const filesToUpload = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        filesToUpload.push(file);
      }
    }

    if (filesToUpload.length > 0) {
      setIsUploading(true);
      try {
        const uploadedUrls = await fileLogic.uploadFiles(filesToUpload);
        setFiles(uploadedUrls);

        setAlertMessage("Files pasted and uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setIsUploading(false);
      }
    }
  }, [setFiles, fileLogic, isUploading, setIsUploading]);

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

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <>
      <Paper
        ref={dropzoneRef}
        elevation={isDragging || isFocused ? 3 : 1}
        sx={{
          p: 1,
          border: isDragging || isFocused
            ? `1px dashed ${theme.vars.palette.primary.main}`
            : `1px dashed ${theme.vars.palette.divider}`,
          backgroundColor: isDragging || isFocused
            ? `color-mix(in srgb, ${theme.vars.palette.primary.light}, transparent 80%)`
            : isUploading
              ? theme.vars.palette.action.disabledBackground
              : theme.vars.palette.background.paper,
          textAlign: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'border 0.2s ease, background-color 0.2s ease',
          opacity: isUploading ? 0.7 : 1,
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
      >
        <Typography
          variant="caption"
          color={isDragging || isFocused ? "primary" : isUploading ? "textSecondary" : "textSecondary"}
        >
          {isDragging
            ? "Release to add files or folders"
            : isFocused
              ? "Press Ctrl+V to paste files"
              : (smallScreen ? "Drop / Paste" : "Drop files or folders, Paste files")}
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