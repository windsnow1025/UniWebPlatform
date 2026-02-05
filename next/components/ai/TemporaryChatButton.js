import {Button} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import React from "react";
import ChatLogic from "../../lib/chat/ChatLogic";

function TemporaryChatButton({
                               setMessages,
                               setSelectedConversationId,
                               setIsTemporaryChat,
                               buttonStyle,
                               clearUIStateRef,
                             }) {
  const handleTemporaryChat = async () => {
    clearUIStateRef.current?.();
    setMessages(ChatLogic.getInitMessages());
    setSelectedConversationId(null);
    setIsTemporaryChat(true);
  };

  const isMainStyle = buttonStyle === "main";
  const buttonProps = isMainStyle ? {
    size: "large",
    variant: "outlined",
    color: "primary",
    fullWidth: false,
    sx: {
      borderRadius: 999,
      px: 4,
      py: 1.2,
      textTransform: 'none',
      fontWeight: 600
    }
  } : {
    size: "small",
    variant: "text",
    fullWidth: true
  };

  return (
    <div className="text-nowrap">
      <Button
        size={buttonProps.size}
        variant={buttonProps.variant}
        color={buttonProps.color}
        startIcon={<ChatBubbleOutlineIcon/>}
        onClick={handleTemporaryChat}
        id={`temporary-chat-button-${buttonStyle}`}
        fullWidth={buttonProps.fullWidth}
        sx={buttonProps.sx}
      >
        Temporary Chat
      </Button>
    </div>
  )
}

export default TemporaryChatButton;