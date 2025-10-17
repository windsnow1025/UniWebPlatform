import React, {useRef, useState} from 'react';
import {Alert, CircularProgress, IconButton, Snackbar, Tooltip} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileLogic from "../../../../lib/common/file/FileLogic";

function FilesUpload({onFilesUpload, isUploading, setIsUploading}) {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const fileLogic = new FileLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const fileList = fileInputRef.current.files;
    await handleUpload(fileList);
    fileInputRef.current.value = '';
  };

  const handleFolderUpload = async (event) => {
    event.preventDefault();
    const fileList = folderInputRef.current.files;
    await handleUpload(fileList);
  };

  const handleUpload = async (fileList) => {
    if (fileList.length > 0) {
      setIsUploading(true);
      try {
        const filesArray = Array.from(fileList);

        const uploadedFileUrls = await fileLogic.uploadFiles(filesArray);

        onFilesUpload(uploadedFileUrls);

        setAlertMessage("Files uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage(error.message);
        setAlertSeverity('error');
      } finally {
        setIsUploading(false);
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerFolderInput = () => {
    folderInputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        hidden
        multiple
        disabled={isUploading}
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderUpload}
        hidden
        webkitdirectory="true"
        disabled={isUploading}
      />
      <Tooltip title={isUploading ? "Uploading..." : "Upload File"}>
        <IconButton onClick={triggerFileInput} size="small" disabled={isUploading}>
          {isUploading ? <CircularProgress size={20}/> : <AttachFileIcon fontSize="small"/>}
        </IconButton>
      </Tooltip>
      <Tooltip title={isUploading ? "Uploading..." : "Upload Folder"}>
        <IconButton onClick={triggerFolderInput} size="small" disabled={isUploading}>
          {isUploading ? <CircularProgress size={20}/> : <FolderOpenIcon fontSize="small"/>}
        </IconButton>
      </Tooltip>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FilesUpload;