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

function MessageDiv({
                      roleInitial,
                      contentInitial,
                      filesInitial,
                      onRoleChange,
                      onContentChange,
                      onFileUpload,
                      useRoleSelect,
                      onMessageDelete,
                      shouldSanitize,
                      editableState = "conditional",
                    }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileService = new FileService();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileUrl = await fileService.upload(file);
        onFileUpload(fileUrl);
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
    navigator.clipboard.writeText(contentInitial);
  };

  return (
    <>
      <Paper elevation={4} className="my-1 p-2 rounded-lg">
        {useRoleSelect ?
          <RoleSelect
            roleInitial={roleInitial}
            onRoleChange={onRoleChange}
          />
          :
          <RoleDiv
            roleInitial={roleInitial}
            onRoleChange={onRoleChange}
          />
        }
        <div className="flex-between">
          <Paper elevation={4} className="inflex-fill my-2">
            <ContentDiv
              contentInitial={contentInitial}
              onContentChange={onContentChange}
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
          {filesInitial && filesInitial.map((file, index) => (
            <div key={index}>
              <picture>
                <img
                  key={index}
                  src={file}
                  alt="file"
                  className="max-w-full"
                />
              </picture>
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
