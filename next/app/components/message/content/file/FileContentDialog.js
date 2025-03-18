import React, {useState} from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import FileUpload from './FileUpload';
import AudioRecord from './AudioRecord';
import FileDropZone from './FileDropZone';

function FileContentDialog({open, onClose, onFileSelected}) {
  const [files, setFiles] = useState([]);

  const handleFileUploadComplete = (fileUrl) => {
    onFileSelected([fileUrl]);
    onClose();
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      onFileSelected(newFiles);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add File Content</DialogTitle>
      <DialogContent>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mb: 2
        }}>
          <FileUpload files={files} setFiles={handleFilesChange}/>
          <AudioRecord setFile={handleFileUploadComplete}/>
        </Box>
        <FileDropZone setFile={(fileUrls) => handleFilesChange(fileUrls)}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FileContentDialog;