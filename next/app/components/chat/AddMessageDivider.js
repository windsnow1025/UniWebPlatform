import { Divider, IconButton, Tooltip, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useState } from "react";
import ChatLogic from "../../../src/conversation/chat/ChatLogic";

function AddMessageDivider({
                             messages,
                             setMessages,
                             index,
                             setIsGenerating,
                             isGeneratingRef,
                             setConversationUpdateTrigger
                           }) {
  const chatLogic = new ChatLogic();
  const [isHovered, setIsHovered] = useState(false);

  const handleMessageAdd = (index) => {
    if (index === messages.length - 1) {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }

    const newMessages = [...messages];
    newMessages.splice(index + 1, 0, chatLogic.emptyUserMessage);
    setMessages(newMessages);

    setConversationUpdateTrigger(true);
  };

  return (
    <div
      className="flex-center-nowrap h-4"
      style={{
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Divider sx={{ flexGrow: 1 }} />
      {isHovered && (
        <Tooltip title="Add Message">
          <IconButton
            aria-label="add"
            onClick={() => handleMessageAdd(index)}
          >
            <AddCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Divider sx={{ flexGrow: 1 }} />
    </div>
  );
}

export default AddMessageDivider;