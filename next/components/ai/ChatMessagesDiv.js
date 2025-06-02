import MessageDiv from "../message/MessageDiv";
import React from "react";
import AddMessageDivider from "./AddMessageDivider";

function ChatMessagesDiv({
                           messages,
                           setMessages,
                           setIsGenerating,
                           isGeneratingRef,
                           setConversationUpdateKey
                         }) {
  const handleMessageUpdate = (id, updatedMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? updatedMessage : msg))
    );
  };

  const handleMessageDelete = (id) => {
    if (messages[messages.length - 1].id === id) {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }

    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));

    setConversationUpdateKey(prev => prev + 1);
  };

  return (
    <div>
      <AddMessageDivider
        messages={messages}
        setMessages={setMessages}
        index={-1}
        setIsGenerating={setIsGenerating}
        isGeneratingRef={isGeneratingRef}
        setConversationUpdateKey={setConversationUpdateKey}
      />
      {messages.map((message, index) => (
        <div key={message.id}>
          <MessageDiv
            message={message}
            setMessage={(updatedMessage) => handleMessageUpdate(message.id, updatedMessage)}
            useRoleSelect={true}
            onMessageDelete={() => handleMessageDelete(message.id)}
          />
          <AddMessageDivider
            messages={messages}
            setMessages={setMessages}
            index={index}
            setIsGenerating={setIsGenerating}
            isGeneratingRef={isGeneratingRef}
            setConversationUpdateKey={setConversationUpdateKey}
          />
        </div>
      ))}
    </div>
  );
}

export default ChatMessagesDiv;