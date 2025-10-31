import MessageDiv from "../message/MessageDiv";
import React, {useCallback} from "react";
import AddMessageDivider from "./AddMessageDivider";
import FileLogic from "../../lib/common/file/FileLogic";
import ChatLogic from "../../lib/chat/ChatLogic";

function ChatMessagesDiv({
                           messages,
                           setMessages,
                           setIsGenerating,
                           isGeneratingRef,
                           setConversationUpdateKey,
                           isTemporaryChat
                         }) {
  const handleMessageUpdate = useCallback((id, updatedMessage) => {
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
  }, [setMessages]);

  const handleMessageDelete = useCallback(async (id) => {
    let fileUrlsToDelete = [];

    // Remove the message from the UI
    setMessages((prevMessages) => {
      // Find files in the message
      const messageToDelete = prevMessages.find(msg => msg.id === id);
      if (messageToDelete) {
        fileUrlsToDelete = ChatLogic.getFileUrlsFromMessage(messageToDelete);
      }

      // Stop generating if the last message is deleted
      if (prevMessages.length > 0 && prevMessages[prevMessages.length - 1].id === id) {
        setIsGenerating(false);
        isGeneratingRef.current = false;
      }
      return prevMessages.filter((msg) => msg.id !== id);
    });

    // Delete the files from storage
    if (fileUrlsToDelete.length > 0) {
      try {
        const fileNames = FileLogic.getFileNamesFromUrls(fileUrlsToDelete);
        const fileLogic = new FileLogic();
        await fileLogic.deleteFiles(fileNames);
      } catch (error) {
        console.error('Failed to delete files from message:', error);
      }
    }

    setConversationUpdateKey(prev => prev + 1);

  }, [setMessages, setIsGenerating, isGeneratingRef, setConversationUpdateKey]);

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
            setMessage={handleMessageUpdate}
            onMessageDelete={handleMessageDelete}
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
