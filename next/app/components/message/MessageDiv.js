import React, {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {Button, IconButton, lighten, LinearProgress, Tooltip} from "@mui/material";
import RoleDiv from './role/RoleDiv';
import RoleSelect from './role/RoleSelect';
import DisplayDiv from "./content/DisplayDiv";
import SortableContents from './content/SortableContents';
import {MessageRoleEnum, ContentTypeEnum} from "../../../client";
import {RoleEditableState} from "../../../src/conversation/chat/Message";

function MessageDiv({
                      message,
                      setMessage,
                      useRoleSelect = false,
                      onMessageDelete = null,
                      shouldSanitize = true,
                      roleEditableState = RoleEditableState.RoleBased,
                    }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useTheme();

  const handleRoleChange = (newRole) => {
    setMessage({...message, role: newRole});
  };

  const handleAddContent = (type) => {
    setMessage({
      ...message,
      contents: [...message.contents, {type, data: ''}]
    });
  };

  const getRoleBorderStyles = (role) => {
    switch (role) {
      case MessageRoleEnum.User:
        return {border: `1px solid ${lighten(theme.palette.primary.main, 0.5)}`};
      case MessageRoleEnum.Assistant:
        return {border: `1px solid ${lighten(theme.palette.secondary.main, 0.5)}`};
      case MessageRoleEnum.System:
        return {border: `1px solid ${lighten(theme.palette.warning.main, 0.5)}`};
      default:
        return {};
    }
  };

  const getMessageContainerStyles = (role) => {
    switch (role) {
      case MessageRoleEnum.User:
        return {justifyContent: 'flex-end'};
      case MessageRoleEnum.Assistant:
        return {justifyContent: 'flex-start'};
      case MessageRoleEnum.System:
        return {justifyContent: 'center'};
      default:
        return {};
    }
  };

  return (
    <div style={{...getMessageContainerStyles(message.role), display: 'flex'}}>
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
          {onMessageDelete && (
            <Tooltip title="Delete Message">
              <IconButton aria-label="delete" onClick={onMessageDelete}>
                <RemoveCircleOutlineIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          )}
        </div>

        <SortableContents
          contents={message.contents}
          setContents={(newContents) => setMessage({...message, contents: newContents})}
          shouldSanitize={shouldSanitize}
          rawEditableState={roleEditableState}
          setUploadProgress={setUploadProgress}
        />

        {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress * 100}/>}

        <DisplayDiv message={message} setMessage={setMessage}/>

        <div className="flex justify-center gap-3 mt-4">
          <Button
            variant="outlined"
            size="small"
            startIcon={<TextSnippetIcon />}
            onClick={() => handleAddContent(ContentTypeEnum.Text)}
          >
            Add Text Content
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AttachFileIcon />}
            onClick={() => handleAddContent(ContentTypeEnum.File)}
          >
            Add File Content
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MessageDiv;