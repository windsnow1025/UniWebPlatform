import {IconButton, Tooltip} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MessageDiv from "../message/MessageDiv";
import React from "react";
import {ChatLogic} from "../../../src/logic/ChatLogic";

function ChatMessages({ messages, setMessages, shouldSanitize, editableState }) {
  const chatLogic = new ChatLogic();

  const handleRoleChange = (index, role) => {
    const newMessages = [...messages];
    newMessages[index].role = role;
    setMessages(newMessages);
  };

  const handleContentChange = (index, content) => {
    const newMessages = [...messages];
    newMessages[index].text = content;
    setMessages(newMessages);
  };

  const handleMessageDelete = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const handleFileUpload = (index, fileUrls) => {
    const newMessages = [...messages];
    const currentMessage = newMessages[index];

    currentMessage.files = fileUrls;
    setMessages(newMessages);
  };

  const handleMessageAdd = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index + 1, 0, chatLogic.emptyUserMessage);
    setMessages(newMessages);
  };


  return (
    <div>
      <div className="flex-between">
        <div className="grow"/>
        <div>
          <Tooltip title="Add">
            <IconButton aria-label="add" onClick={() => handleMessageAdd(-1)}>
              <AddCircleIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {messages.map((message, index) => (
        <div key={index}>
          <MessageDiv
            role={message.role}
            setRole={(role) => handleRoleChange(index, role)}
            content={message.text}
            setContent={(content) => handleContentChange(index, content)}
            files={message.files}
            setFiles={(fileUrl) => {handleFileUpload(index, fileUrl)}}
            useRoleSelect={true}
            onMessageDelete={() => handleMessageDelete(index)}
            shouldSanitize={shouldSanitize}
            editableState={editableState}
          />
          <div className="flex">
            <div className="grow"/>
            <div>
              <Tooltip title="Add">
                <IconButton aria-label="add" onClick={() => handleMessageAdd(index)}>
                  <AddCircleIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatMessages;