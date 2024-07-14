import React from "react";
import SimpleMessageDiv from "./SimpleMessageDiv";

function SimpleChatMessagesDiv({ messages, setMessages }) {
  const handleContentChange = (index, content) => {
    const newMessages = [...messages];
    newMessages[index].text = content;
    setMessages(newMessages);
  };

  return (
    <div>
      <div className="flex-between">
        <div className="inflex-fill"/>
      </div>
      {messages.map((message, index) => (
        <div key={index}>
          <SimpleMessageDiv
            role={message.role}
            content={message.text}
            setContent={(content) => handleContentChange(index, content)}
          />
        </div>
      ))}
    </div>
  )
}

export default SimpleChatMessagesDiv;