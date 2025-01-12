import React, {useState} from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {Alert, IconButton, LinearProgress, Paper, Snackbar, Tooltip} from "@mui/material";
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileDiv from "./FileDiv";
import FileUpload from './FileUpload';
import {EditableState} from "../../../src/conversation/chat/Message";

function MessageDiv({
                      message,
                      setMessage,
                      useRoleSelect = false,
                      onMessageDelete = null,
                      shouldSanitize = true,
                      editableState = EditableState.RoleBased,
                    }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleRoleChange = (newRole) => {
    setMessage({
      ...message,
      role: newRole
    });
  };

  const handleContentChange = (newContent) => {
    setMessage({
      ...message,
      text: newContent
    });
  };

  const handleFileChange = (fileUrls) => {
    setMessage({
      ...message,
      files: fileUrls
    });
  };

  let convertedEditableState = editableState;
  if (editableState === EditableState.RoleBased) {
    convertedEditableState = message.role === "assistant"
      ? EditableState.AlwaysFalse
      : EditableState.AlwaysTrue;
  }

  const handleContentCopy = () => {
    navigator.clipboard.writeText(message.text);
    setAlertMessage("Content copied to clipboard");
    setAlertSeverity('success');
    setAlertOpen(true);
  };

  return (
    <>
      <Paper elevation={2} className="my-1 p-2 rounded-lg">
        {useRoleSelect ?
          <RoleSelect
            role={message.role}
            setRole={handleRoleChange}
          />
          :
          <RoleDiv
            role={message.role}
            setRole={handleRoleChange}
          />
        }
        <div className="flex">
          <Paper elevation={4} className="inflex-fill my-2">
            <ContentDiv
              content={message.text}
              setContent={handleContentChange}
              shouldSanitize={shouldSanitize}
              editableState={convertedEditableState}
              files={message.files}
              setFiles={handleFileChange}
              setUploadProgress={setUploadProgress}
            />
          </Paper>
          <div className="flex-column self-end">
            <FileUpload
              files={message.files}
              setFiles={handleFileChange}
              setUploadProgress={setUploadProgress}
            />
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
        {uploadProgress > 0 && (
          <LinearProgress variant="determinate" value={uploadProgress * 100}/>
        )}
        <div className="flex-start-start">
          {message.files && message.files.map((file) => (
            <FileDiv
              key={file}
              fileUrl={file}
              files={message.files}
              setFiles={handleFileChange}
            />
          ))}
        </div>
      </Paper>
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

export default MessageDiv;