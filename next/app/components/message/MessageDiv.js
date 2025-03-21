import React, {useEffect} from 'react';
import {useTheme} from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton, lighten, Tooltip} from "@mui/material";
import RoleDiv from './role/RoleDiv';
import RoleSelect from './role/RoleSelect';
import DisplayDiv from "./content/display/DisplayDiv";
import SortableContents from './content/SortableContents';
import AddContentArea from "./content/create/AddContentArea";
import {MessageRoleEnum} from "../../../client";
import {convertToRawEditableState, RawEditableState, RoleEditableState} from "../../../src/conversation/chat/Message";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function MessageDiv({
                      message,
                      setMessage,
                      useRoleSelect = false,
                      onMessageDelete = null,
                      shouldSanitize = true,
                      roleEditableState = RoleEditableState.RoleBased,
                    }) {
  const theme = useTheme();

  useEffect(() => {
    console.log(message)
  }, [message]);

  const handleRoleChange = (newRole) => {
    setMessage({...message, role: newRole});
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

  const rawEditableState = convertToRawEditableState(roleEditableState, message.role)

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
          message={message}
          setMessage={setMessage}
          shouldSanitize={shouldSanitize}
          rawEditableState={rawEditableState}
        />

        <DisplayDiv message={message} setMessage={setMessage}/>

        {rawEditableState !== RawEditableState.AlwaysFalse && (
          <AddContentArea message={message} setMessage={setMessage} />
        )}
      </div>
    </div>
  );
}

export default MessageDiv;
