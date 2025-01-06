import {Divider, IconButton, Tooltip} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React from "react";
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
    <Divider>
      <Tooltip title="Add Message">
        <IconButton aria-label="add" onClick={() => handleMessageAdd(index)}>
          <AddCircleIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
    </Divider>
  )
}

export default AddMessageDivider;