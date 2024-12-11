import MessageDiv from "../../message/MessageDiv";
import React from "react";
import AdvancedAddMessageDivider from "./AdvancedAddMessageDivider";

function AdvancedChatMessagesDiv({
                                   messages,
                                   setMessages,
                                   shouldSanitize,
                                   editableState,
                                   setIsGenerating,
                                   isGeneratingRef,
                                 }) {
  const handleMessageUpdate = (index, updatedMessage) => {
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      newMessages[index] = updatedMessage;
      return newMessages;
    });
  };

  const handleMessageDelete = (index) => {
    if (index === messages.length - 1) {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }

    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  return (
    <div>
      <AdvancedAddMessageDivider
        messages={messages}
        setMessages={setMessages}
        index={-1}
        setIsGenerating={setIsGenerating}
        isGeneratingRef={isGeneratingRef}
      />
      {messages.map((message, index) => (
        <div key={index}>
          <MessageDiv
            message={message}
            setMessage={(updatedMessage) => handleMessageUpdate(index, updatedMessage)}
            useRoleSelect={true}
            onMessageDelete={() => handleMessageDelete(index)}
            shouldSanitize={shouldSanitize}
            editableState={editableState}
          />
          <AdvancedAddMessageDivider
            messages={messages}
            setMessages={setMessages}
            index={index}
            setIsGenerating={setIsGenerating}
            isGeneratingRef={isGeneratingRef}
          />
        </div>
      ))}
    </div>
  );
}

export default AdvancedChatMessagesDiv;