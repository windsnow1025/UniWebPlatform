import {Alert, Button, Snackbar, CircularProgress} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import React, {useState} from "react";
import ChatLogic from "../../lib/chat/ChatLogic";

function TemporaryChatButton({
                               setMessages,
                               setSelectedConversationId,
                               setIsTemporaryChat,
                               size = "large",
                             }) {
  const handleTemporaryChat = async () => {
    setMessages(ChatLogic.getInitMessages());
    setSelectedConversationId(null);
    setIsTemporaryChat(true);
  };

  return (
    <div className="text-nowrap">
      <Button
        size={size}
        variant="text"
        startIcon={<ChatBubbleOutlineIcon/>}
        onClick={handleTemporaryChat}
        id={`temporary-chat-button-${size}`}
        fullWidth
      >
        Temporary Chat
      </Button>
    </div>
  )
}

export default TemporaryChatButton;