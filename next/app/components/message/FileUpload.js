import React, {useRef, useState} from 'react';
import {Alert, CircularProgress, IconButton, Snackbar, Tooltip} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileLogic from "../../../src/common/file/FileLogic";
import {wait} from "../../utils/Wait";

function FileUpload({ files, setFiles, setUploadProgress }) {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileLogic = new FileLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const fileList = fileInputRef.current.files;
    await handleUpload(fileList);
  };

  const handleFolderUpload = async (event) => {
    event.preventDefault();
    const fileList = folderInputRef.current.files;
    await handleUpload(fileList);
  };

  const handleUpload = async (fileList) => {
    if (fileList.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const totalFiles = fileList.length;
        let uploadedFiles = 0;

        const uploadPromises = Array.from(fileList).map(file => {
          return fileLogic.upload(file, (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * (1 / totalFiles);
            setUploadProgress(prevProgress => prevProgress + progress);
          }).then(url => {
            uploadedFiles += 1;
            setUploadProgress(uploadedFiles / totalFiles);
            return url;
          });
        });

        const uploadedFileUrls = await Promise.all(uploadPromises);
        const newFiles = files.concat(uploadedFileUrls);

        await wait(5);

        setFiles(newFiles);
        setAlertMessage("Files uploaded successfully");
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage(error.message);
        setAlertSeverity('error');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
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
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderUpload}
        hidden
        webkitdirectory="true"
      />
      <Tooltip title="Upload File">
        <IconButton aria-label="upload-file" onClick={triggerFileInput}>
          {isUploading ? <CircularProgress size={24}/> : <AttachFileIcon/>}
        </IconButton>
      </Tooltip>
      <Tooltip title="Upload Folder">
        <IconButton aria-label="upload-folder" onClick={triggerFolderInput}>
          {isUploading ? <CircularProgress size={24}/> : <FolderOpenIcon/>}
        </IconButton>
      </Tooltip>
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

export default FileUpload;