import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Paper, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileDiv from "./FileDiv";
import FileUpload from './FileUpload';

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
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'

  const handleContentCopy = () => {
    navigator.clipboard.writeText(content);
    setAlertMessage("Content copied to clipboard");
    setAlertSeverity('success');
    setAlertOpen(true);
  };

  const handleFileDelete = (fileUrl) => {
    const newFiles = files.filter(file => file !== fileUrl);
    setFiles(newFiles);
    setAlertMessage("File deleted successfully");
    setAlertSeverity('success');
    setAlertOpen(true);
  };

  return (
    <>
      <Paper elevation={2} className="my-1 p-2 rounded-lg">
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
          <div className="flex-column self-end">
            {setFiles &&
              <FileUpload files={files} setFiles={setFiles} />
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
        <div className="flex-start">
          {files && files.map((file) => (
            <FileDiv key={file} fileUrl={file} handleFileDelete={handleFileDelete} />
          ))}
        </div>
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

export default MessageDiv;