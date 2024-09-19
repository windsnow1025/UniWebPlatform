import React from "react";
import SimpleMessageDiv from "./SimpleMessageDiv";

function SimpleChatMessagesDiv({ messages }) {
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
            files={message.files}
          />
        </div>
      ))}
    </div>
  )
}

export default SimpleChatMessagesDiv;