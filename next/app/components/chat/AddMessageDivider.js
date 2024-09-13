import {Divider, IconButton, Tooltip} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React from "react";
import ChatLogic from "../../../src/conversation/chat/ChatLogic";

function AddMessageDivider({ messages, setMessages, index }) {
  const chatLogic = new ChatLogic();

  const handleMessageAdd = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index + 1, 0, chatLogic.emptyUserMessage);
    setMessages(newMessages);
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