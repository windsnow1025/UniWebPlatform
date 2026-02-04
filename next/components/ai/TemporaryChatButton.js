import {Button} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import React from "react";
import ChatLogic from "../../lib/chat/ChatLogic";

function TemporaryChatButton({
                               setMessages,
                               setSelectedConversationId,
                               setIsTemporaryChat,
                               size,
                               clearUIStateRef,
                             }) {
  const handleTemporaryChat = async () => {
    clearUIStateRef.current?.();
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