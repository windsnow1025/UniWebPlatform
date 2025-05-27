import React, {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton, lighten, Tooltip} from "@mui/material";
import RoleDiv from './role/RoleDiv';
import RoleSelect from './role/RoleSelect';
import DisplayDiv from "./content/display/DisplayDiv";
import SortableContents from './content/SortableContents';
import AddContentArea from "./content/create/AddContentArea";
import {MessageRoleEnum} from "../../client";
import {RawEditableState} from "../../lib/common/message/EditableState";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function MessageDiv({
                      message,
                      setMessage,
                      useRoleSelect = false,
                      onMessageDelete = null,
                    }) {
  const theme = useTheme();
  const [showPreview, setShowPreview] = useState(message.role !== MessageRoleEnum.User);

  const handleRoleChange = (newRole) => {
    setMessage({...message, role: newRole});
    setShowPreview(newRole !== MessageRoleEnum.User);
  };

  const handleContentsChange = (newContents) => {
    setMessage({...message, contents: newContents});
  };

  const handleDisplayChange = (newDisplay) => {
    setMessage({...message, display: newDisplay});
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
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

  const handleCopyMessage = () => {
    const textToCopy = message.contents
      .filter(content => content.type !== 'File')
      .map(content => content.data)
      .join('\n');

    navigator.clipboard.writeText(textToCopy);
  };

  const rawEditableState = showPreview ? RawEditableState.AlwaysFalse : RawEditableState.AlwaysTrue;

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

          <Tooltip title={showPreview ? "Edit Mode" : "Preview Mode"}>
            <IconButton aria-label="toggle-preview" onClick={togglePreview}>
              {showPreview ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
            </IconButton>
          </Tooltip>

          {rawEditableState === RawEditableState.AlwaysFalse && (
            <Tooltip title="Copy Message">
              <IconButton aria-label="copy" onClick={handleCopyMessage}>
                <ContentCopyIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          )}
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
          setContents={handleContentsChange}
          rawEditableState={rawEditableState}
        />

        <DisplayDiv
          display={message.display}
          setDisplay={handleDisplayChange}
        />

        {rawEditableState !== RawEditableState.AlwaysFalse && (
          <AddContentArea
            contents={message.contents}
            setContents={handleContentsChange}
          />
        )}
      </div>
    </div>
  );
}

export default MessageDiv;
