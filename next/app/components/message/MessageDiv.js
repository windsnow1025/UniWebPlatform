import React, {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {Alert, IconButton, lighten, LinearProgress, Paper, Snackbar, Tooltip} from "@mui/material";
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileUpload from './FileUpload';
import AudioRecord from './AudioRecord';
import {convertToRawEditableState, RoleEditableState, MessageRole} from "../../../src/conversation/chat/Message";
import SortableFileDivs from './SortableFileDivs';
import DisplayDiv from "./DisplayDiv";

function MessageDiv({
                      message,
                      setMessage,
                      useRoleSelect = false,
                      onMessageDelete = null,
                      shouldSanitize = true,
                      roleEditableState = RoleEditableState.RoleBased,
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

  const rawEditableState = convertToRawEditableState(roleEditableState, message.role);

  const handleContentCopy = () => {
    navigator.clipboard.writeText(message.text);
    setAlertMessage("Content copied to clipboard");
    setAlertSeverity('success');
    setAlertOpen(true);
  };

  const theme = useTheme();

  const getRoleBorderStyles = (role) => {
    switch (role) {
      case MessageRole.User:
        return {border: `1px solid ${lighten(theme.palette.primary.main, 0.5)}`};
      case MessageRole.Assistant:
        return {border: `1px solid ${lighten(theme.palette.secondary.main, 0.5)}`};
      case MessageRole.System:
        return {border: `1px solid ${lighten(theme.palette.warning.main, 0.5)}`};
      default:
        return {};
    }
  };

  const getMessageContainerStyles = (role) => {
    switch (role) {
      case MessageRole.User:
        return {justifyContent: 'flex-end'};
      case MessageRole.Assistant:
        return {justifyContent: 'flex-start'};
      case MessageRole.System:
        return {justifyContent: 'center'};
      default:
        return {};
    }
  };

  return (
    <div style={{
      ...getMessageContainerStyles(message.role),
      display: 'flex',
    }}>
      <div
        className="px-2 py-3 rounded-lg"
        style={{
          ...getRoleBorderStyles(message.role),
          minWidth: "75%",
          maxWidth: "95%",
        }}
      >
        <div className="flex">
          {useRoleSelect ? (
            <RoleSelect role={message.role} setRole={handleRoleChange}/>
          ) : (
            <RoleDiv role={message.role} setRole={handleRoleChange}/>
          )}
          <div className="inflex-fill"></div>
          <AudioRecord
            files={message.files}
            setFiles={handleFileChange}
            setUploadProgress={setUploadProgress}
          />
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
          {onMessageDelete && (
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={onMessageDelete}>
                <RemoveCircleOutlineIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          )}
        </div>
        <Paper elevation={4} className="inflex-fill p-1">
          <ContentDiv
            content={message.text}
            setContent={handleContentChange}
            shouldSanitize={shouldSanitize}
            rawEditableState={rawEditableState}
            files={message.files}
            setFiles={handleFileChange}
            setUploadProgress={setUploadProgress}
          />
        </Paper>
        <DisplayDiv message={message} setMessage={setMessage}/>
        {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress * 100}/>}
        <SortableFileDivs files={message.files} setFiles={handleFileChange}/>
      </div>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MessageDiv;