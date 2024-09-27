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
    if (index ===  messages.length - 1) {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }

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
            role={message.role}
            setRole={(role) => handleRoleChange(index, role)}
            content={message.text}
            setContent={(content) => handleContentChange(index, content)}
            files={message.files}
            setFiles={(fileUrl) => {
              handleFileUpload(index, fileUrl)
            }}
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
  )
}

export default AdvancedChatMessagesDiv;