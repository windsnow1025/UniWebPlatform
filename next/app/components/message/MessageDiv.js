import React, {useState} from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {Alert, IconButton, LinearProgress, Paper, Snackbar, Tooltip} from "@mui/material";
import RoleDiv from './RoleDiv';
import RoleSelect from './RoleSelect';
import ContentDiv from './ContentDiv';
import FileUpload from './FileUpload';
import {EditableState} from "../../../src/conversation/chat/Message";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import {closestCenter, DndContext} from "@dnd-kit/core";
import SortableFileDiv from "./SortableFileDiv";

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

  const handleDragEnd = (event) => {
    const {active, over} = event;

    if (active.id !== over.id) {
      const oldIndex = message.files.indexOf(active.id);
      const newIndex = message.files.indexOf(over.id);
      const newFiles = arrayMove(message.files, oldIndex, newIndex);
      handleFileChange(newFiles);
    }
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
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={message.files}>
            <div className="flex-start-start">
              {message.files && message.files.map((file) => (
                <SortableFileDiv
                  key={file}
                  fileUrl={file}
                  files={message.files}
                  setFiles={handleFileChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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