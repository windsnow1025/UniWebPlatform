import MessageDiv from "../message/MessageDiv";
import React from "react";
import AddMessageDivider from "./AddMessageDivider";
import FileLogic from "../../lib/common/file/FileLogic";
import { ContentTypeEnum } from "../../client";
import ChatLogic from "../../lib/chat/ChatLogic";

function ChatMessagesDiv({
                           messages,
                           setMessages,
                           setIsGenerating,
                           isGeneratingRef,
                           setConversationUpdateKey,
                           isTemporaryChat
                         }) {
  const handleMessageUpdate = (id, updatedMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map((prevMessage) => {
        if (prevMessage.id === id) {
          return typeof updatedMessage === 'function'
            ? updatedMessage(prevMessage)
            : updatedMessage;
        }
        return prevMessage;
      })
    );
  };

  const handleMessageDelete = async (id) => {
    if (messages[messages.length - 1].id === id) {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }

    // Find files in the message
    const messageToDelete = messages.find(msg => msg.id === id);
    let fileUrls = [];
    if (messageToDelete) {
      fileUrls = ChatLogic.getFileUrlsFromMessage(messageToDelete);
    }

    // Delete the files from storage
    if (fileUrls.length > 0) {
      try {
        const fileNames = FileLogic.getFileNamesFromUrls(fileUrls);
        const fileLogic = new FileLogic();
        await fileLogic.deleteFiles(fileNames);
      } catch (error) {
        console.error('Failed to delete files from message:', error);
      }
    }

    // Remove the message from the UI
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
            onMessageDelete={() => handleMessageDelete(message.id)}
            setConversationUpdateKey={setConversationUpdateKey}
            isTemporaryChat={isTemporaryChat}
            isGeneratingRef={isGeneratingRef}
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
