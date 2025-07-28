import {Alert, Button, Snackbar, CircularProgress} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import React, {useState} from "react";
import ChatLogic from "../../lib/chat/ChatLogic";

function TemporaryChatButton({
                               setMessages,
                               setSelectedConversationId,
                             }) {
  const handleTemporaryChat = async () => {
    const defaultMessages = ChatLogic.getInitMessages();
    setMessages(defaultMessages);
    setSelectedConversationId(null);
  };

  return (
    <div className="text-nowrap">
      <Button
        size="large"
        variant="text"
        startIcon={<ChatBubbleOutlineIcon/>}
        onClick={handleTemporaryChat}
        id="temporary-chat-button"
      >
        Temporary Chat
      </Button>
    </div>
  )
}

export default TemporaryChatButton;