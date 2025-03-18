import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper
} from '@mui/material';
import FileUpload from './FileUpload';
import AudioRecord from './AudioRecord';
import FileDropZone from './FileDropZone';

function FileContentDialog({ open, onClose, onFileSelected }) {
  const [files, setFiles] = useState([]);

  const handleFileUploadComplete = (fileUrl) => {
    onFileSelected(fileUrl);
    onClose();
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      onFileSelected(newFiles[newFiles.length - 1]); // Use the last uploaded file
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add File Content</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Upload files or record audio:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <FileUpload files={files} setFiles={handleFilesChange} />
            <AudioRecord setFile={handleFileUploadComplete} />
          </Box>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Or drag & drop files here:
        </Typography>
        <FileDropZone setFile={handleFileUploadComplete} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FileContentDialog;