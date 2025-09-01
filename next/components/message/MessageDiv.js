import React, {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton, lighten, Tooltip} from "@mui/material";
import RoleSelect from './role/RoleSelect';
import DisplayDiv from "./content/display/DisplayDiv";
import ThoughtDiv from "./content/thought/ThoughtDiv";
import SortableContents from './content/SortableContents';
import AddContentArea from "./content/create/AddContentArea";
import {MessageRoleEnum, ContentTypeEnum} from "../../client";
import {RawEditableState} from "../../lib/common/message/EditableState";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function MessageDiv({
                      message,
                      setMessage,
                      onMessageDelete,
                      setConversationUpdateKey,
                      isTemporaryChat = false,
                    }) {
  const theme = useTheme();
  const [showPreview, setShowPreview] = useState(message.role !== MessageRoleEnum.User);

  const handleRoleChange = (newRole) => {
    setMessage({...message, role: newRole});
    setShowPreview(newRole !== MessageRoleEnum.User);

    setConversationUpdateKey(prev => prev + 1);
  };

  const handleContentsChange = (newContents) => {
    setMessage({...message, contents: newContents});
  };

  const handleDisplayChange = (newDisplay) => {
    setMessage({...message, display: newDisplay});
  };

  const handleThoughtChange = (newThought) => {
    setMessage({...message, thought: newThought});
  };

  const getRoleBorderStyles = (role) => {
    switch (role) {
      case MessageRoleEnum.User:
        return {
          border: `1px solid color-mix(in srgb, ${theme.vars.palette.primary.main}, white 50%)`
        };
      case MessageRoleEnum.Assistant:
        return {
          border: `1px solid color-mix(in srgb, ${theme.vars.palette.secondary.main}, white 50%)`
        };
      case MessageRoleEnum.System:
        return {
          border: `1px solid color-mix(in srgb, ${theme.vars.palette.warning.main}, white 50%)`
        };
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

  const hasText = Array.isArray(message.contents) && message.contents.some(c => c.type === ContentTypeEnum.Text && c.data && String(c.data).length > 0);

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
          <RoleSelect role={message.role} setRole={handleRoleChange}/>
          <div className="inflex-fill"></div>

          <Tooltip title={showPreview ? "Edit Mode" : "Preview Mode"}>
            <IconButton size="small" onClick={() => {
              setShowPreview(!showPreview)
            }}>
              {showPreview ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
            </IconButton>
          </Tooltip>

          {rawEditableState === RawEditableState.AlwaysFalse && (
            <Tooltip title="Copy Message">
              <IconButton size="small" onClick={handleCopyMessage}>
                <ContentCopyIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete Message">
            <IconButton size="small" onClick={onMessageDelete}>
              <RemoveCircleOutlineIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        </div>

        <ThoughtDiv
          thought={message.thought}
          setThought={handleThoughtChange}
          isPreview={showPreview}
          hasText={hasText}
        />

        <SortableContents
          contents={message.contents}
          setContents={handleContentsChange}
          rawEditableState={rawEditableState}
          setConversationUpdateKey={setConversationUpdateKey}
          isTemporaryChat={isTemporaryChat}
        />

        <DisplayDiv
          display={message.display}
          setDisplay={handleDisplayChange}
          isPreview={showPreview}
        />

        {rawEditableState !== RawEditableState.AlwaysFalse && !isTemporaryChat && (
          <AddContentArea
            contents={message.contents}
            setContents={handleContentsChange}
            setConversationUpdateKey={setConversationUpdateKey}
          />
        )}
      </div>
    </div>
  );
}

export default MessageDiv;
