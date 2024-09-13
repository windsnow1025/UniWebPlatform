import MessageDiv from "../message/MessageDiv";
import React from "react";
import AddMessageDivider from "./AddMessageDivider";

function ChatMessagesDiv({ messages, setMessages, shouldSanitize, editableState }) {
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

  return (
    <div>
      <AddMessageDivider
        messages={messages}
        setMessages={setMessages}
        index={-1}
      />
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
          <AddMessageDivider
            messages={messages}
            setMessages={setMessages}
            index={index}
          />
        </div>
      ))}
    </div>
  )
}

export default ChatMessagesDiv;