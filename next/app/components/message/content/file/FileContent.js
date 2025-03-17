import React, { useState } from 'react';
import { Alert, Button, CircularProgress, Snackbar, Tooltip } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import FileLogic from "../../../../../src/common/file/FileLogic";

function FileContent({ file, setFile, setUploadProgress }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileLogic = new FileLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const fileInputRef = React.useRef(null);
  const folderInputRef = React.useRef(null);

  // File upload functions
  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = await fileLogic.uploadFiles([file], (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        setUploadProgress(progress);
      });

      setFile(uploadedUrls[0]);

      setAlertMessage("File uploaded successfully");
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleFolderUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      uploadFile(files[0]); // For simplicity, just upload the first file
    }
  };

  const handlePaste = async (event) => {
    const items = event.clipboardData.items;
    const filesToUpload = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          filesToUpload.push(file);
        }
      }
    }

    if (filesToUpload.length === 0) {
      return;
    }

    event.preventDefault();
    uploadFile(filesToUpload[0]); // Upload the first file
  };

  // Render file preview or upload controls
  const renderFileContent = () => {
    if (file) {
      // Display file preview based on file type
      const fileExtension = file.split('.').pop().toLowerCase();

      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        return (
          <div className="file-preview">
            <img src={file} alt="File preview" className="max-w-full h-auto" />
            <div className="mt-2 text-sm text-gray-500 break-all">{file}</div>
          </div>
        );
      } else if (['mp3', 'wav', 'ogg', 'webm'].includes(fileExtension)) {
        return (
          <div className="file-preview">
            <audio controls src={file} className="w-full" />
            <div className="mt-2 text-sm text-gray-500 break-all">{file}</div>
          </div>
        );
      } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
        return (
          <div className="file-preview">
            <video controls src={file} className="max-w-full h-auto" />
            <div className="mt-2 text-sm text-gray-500 break-all">{file}</div>
          </div>
        );
      } else {
        // Generic file display
        return (
          <div className="file-preview p-3 border rounded">
            <div className="flex items-center">
              <UploadFileIcon className="mr-2" />
              <span className="break-all">{file.split('/').pop()}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500 break-all">{file}</div>
          </div>
        );
      }
    } else {
      // Show upload controls
      return (
        <div
          className="border-2 border-dashed p-4 rounded-lg text-center"
          onPaste={handlePaste}
          tabIndex={0} // Make div focusable for paste events
        >
          <p className="mb-3">Drag & drop a file here, paste, or use the buttons below</p>
          <div className="flex justify-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current.click()}
            >
              Upload File
            </Button>

            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFolderUpload}
              webkitdirectory=""
              directory=""
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              startIcon={<FolderIcon />}
              onClick={() => folderInputRef.current.click()}
            >
              Upload Folder
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="file-content-div">
      {isUploading ? (
        <div className="text-center p-4">
          <CircularProgress size={24} />
          <p className="mt-2">Uploading file...</p>
        </div>
      ) : (
        renderFileContent()
      )}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default FileContent;