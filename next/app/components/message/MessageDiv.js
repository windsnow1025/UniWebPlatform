import React, {useRef, useState} from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {CircularProgress, IconButton, Paper, Tooltip} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileService from "../../../src/service/FileService";
import Snackbar from "@mui/material/Snackbar";
import mime from 'mime';

function MessageDiv({
                      role,
                      setRole,
                      content,
                      setContent,
                      files = null,
                      onFileUpload = () => {},
                      useRoleSelect = false,
                      onMessageDelete = null,
                      shouldSanitize = true,
                      editableState = "conditional",
                    }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileService = new FileService();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const files = fileInputRef.current.files;
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const uploadPromises = Array.from(files).map(file => fileService.upload(file));
        const fileUrls = await Promise.all(uploadPromises);
        onFileUpload(fileUrls);
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage(error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleContentCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const renderFile = (fileUrl) => {
    const mimeType = mime.getType(fileUrl);
    if (mimeType && mimeType.startsWith('image/')) {
      return <img src={fileUrl} alt="file" className="max-w-full" />;
    } else {
      const fileName = fileUrl.split('/').pop();
      return <span>{fileName}</span>;
    }
  };

  return (
    <>
      <Paper elevation={4} className="my-1 p-2 rounded-lg">
        {useRoleSelect ?
          <RoleSelect
            role={role}
            setRole={setRole}
          />
          :
          <RoleDiv
            role={role}
            setRole={setRole}
          />
        }
        <div className="flex-between">
          <Paper elevation={4} className="inflex-fill my-2">
            <ContentDiv
              content={content}
              setContent={setContent}
              shouldSanitize={shouldSanitize}
              editableState={editableState}
            />
          </Paper>
          <div className="flex-column inflex-end">
            {onFileUpload &&
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{display: 'none'}}
                  multiple
                />
                <Tooltip title="Upload">
                  <IconButton aria-label="upload" onClick={triggerFileInput}>
                    {isUploading ? <CircularProgress size={24}/> : <AttachFileIcon/>}
                  </IconButton>
                </Tooltip>
              </>
            }
            <Tooltip title="Copy">
              <IconButton aria-label="copy" onClick={handleContentCopy}>
                <ContentCopyIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
            {onMessageDelete &&
              <Tooltip title="Delete">
                <IconButton aria-label="delete" onClick={onMessageDelete}>
                  <RemoveCircleOutlineIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            }
          </div>
        </div>
        <div>
          {files && files.map((file, index) => (
            <div key={index}>
              {renderFile(file)}
            </div>
          ))}
        </div>
      </Paper>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </>
  );
}

export default MessageDiv;
