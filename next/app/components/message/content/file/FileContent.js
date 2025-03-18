import React, { useState } from 'react';
import { Alert, Button, CircularProgress, Snackbar, Tooltip } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import FileLogic from "../../../../../src/common/file/FileLogic";

function FileContent({ file}) {

  const renderFileContent = () => {
    if (file) {
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
    }
  };

  return (
    <div className="file-content-div">
      {renderFileContent()}
    </div>
  );
}

export default FileContent;