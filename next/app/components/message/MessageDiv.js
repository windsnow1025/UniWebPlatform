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
                      files = [],
                      setFiles = null,
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
    const fileList = fileInputRef.current.files;
    if (fileList.length > 0) {
      setIsUploading(true);
      try {
        const uploadPromises = Array.from(fileList).map(file => fileService.upload(file));
        const uploadedFileUrls = await Promise.all(uploadPromises);
        const newFiles = files.concat(uploadedFileUrls);
        setFiles(newFiles);
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

  const handleFileDelete = (fileUrl) => {
    const newFiles = files.filter(file => file !== fileUrl);
    setFiles(newFiles);
  };

  const renderFile = (fileUrl) => {
    const mimeType = mime.getType(fileUrl);
    const fileName = fileUrl.split('/').pop();
    return (
      <div className="flex" key={fileUrl}>
        <div className="inflex-fill">
          {mimeType && mimeType.startsWith('image/') ? (
            <img src={fileUrl} alt={fileName} className="max-w-full"/>
          ) : (
            <span>{fileName}</span>
          )}
        </div>
        <div className="inflex-end">
          <IconButton aria-label="delete-file" onClick={() => handleFileDelete(fileUrl)}>
            <RemoveCircleOutlineIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
    );
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
        <div className="flex">
          <Paper elevation={4} className="inflex-fill my-2">
            <ContentDiv
              content={content}
              setContent={setContent}
              shouldSanitize={shouldSanitize}
              editableState={editableState}
            />
          </Paper>
          <div className="flex-column inflex-end">
            {setFiles &&
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