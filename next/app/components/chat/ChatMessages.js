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

  const handleFileUpload = (index, fileUrl) => {
    const newMessages = [...messages];
    const currentMessage = newMessages[index];

    currentMessage.files = (currentMessage.files || []).concat(fileUrl);
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
        <div className="inflex-fill"/>
        <div className="inflex-end">
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
            roleInitial={message.role}
            contentInitial={message.text}
            filesInitial={message.files}
            onRoleChange={(role) => handleRoleChange(index, role)}
            onContentChange={(content) => handleContentChange(index, content)}
            onFileUpload={(fileUrl) => {
              handleFileUpload(index, fileUrl)
            }}
            useRoleSelect={true}
            onMessageDelete={() => handleMessageDelete(index)}
            shouldSanitize={shouldSanitize}
            editableState={editableState}
          />
          <div className="flex-between">
            <div className="inflex-fill"/>
            <div className="inflex-end">
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