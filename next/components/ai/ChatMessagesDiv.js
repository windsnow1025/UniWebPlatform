import MessageDiv from "../message/MessageDiv";
import React, {useCallback, useState} from "react";
import AddMessageDivider from "./AddMessageDivider";
import FileLogic from "../../lib/common/file/FileLogic";
import ChatLogic from "../../lib/chat/ChatLogic";
import {Alert, Snackbar} from "@mui/material";

function ChatMessagesDiv({
                           messages,
                           setMessages,
                           isGenerating,
                           setIsGenerating,
                           isGeneratingRef,
                           abortGenerateRef,
                           setConversationUpdateKey,
                           promptsReloadKey,
                           setPromptsReloadKey,
                           isTemporaryChat,
                           isLastChunkThought,
                         }) {
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const fileLogic = new FileLogic();

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
    const isDeletingLastMessage = messages.length > 0 && messages[messages.length - 1].id === id;
    if (isDeletingLastMessage && isGeneratingRef.current) {
      abortGenerateRef.current();
    }

    // Remove the message from the UI
    setMessages((prevMessages) => {
      // Find files in the message
      const messageToDelete = prevMessages.find(msg => msg.id === id);
      if (messageToDelete) {
        fileUrlsToDelete = ChatLogic.getFileUrlsFromMessage(messageToDelete);
      }

      return prevMessages.filter((msg) => msg.id !== id);
    });

    // Delete the files from storage
    if (fileUrlsToDelete.length > 0) {
      try {
        const filenames = FileLogic.getFilenamesFromUrls(fileUrlsToDelete);
        await fileLogic.deleteFiles(filenames);
      } catch (err) {
        setAlertMessage(err.message);
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    }

    setConversationUpdateKey(prev => prev + 1);

  }, [messages, setMessages, setIsGenerating, isGeneratingRef, abortGenerateRef, setConversationUpdateKey]);

  return (
    <div>
      <AddMessageDivider
        messages={messages}
        setMessages={setMessages}
        index={-1}
        setIsGenerating={setIsGenerating}
        isGeneratingRef={isGeneratingRef}
        abortGenerateRef={abortGenerateRef}
        setConversationUpdateKey={setConversationUpdateKey}
      />
      {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          const isThoughtLoading = isLastMessage && isGenerating && isLastChunkThought;
          return (
            <div key={message.id}>
              <MessageDiv
                message={message}
                setMessage={handleMessageUpdate}
                onMessageDelete={handleMessageDelete}
                setConversationUpdateKey={setConversationUpdateKey}
                promptsReloadKey={promptsReloadKey}
                setPromptsReloadKey={setPromptsReloadKey}
                isTemporaryChat={isTemporaryChat}
                isThoughtLoading={isThoughtLoading}
              />
              <AddMessageDivider
                messages={messages}
                setMessages={setMessages}
                index={index}
                setIsGenerating={setIsGenerating}
                isGeneratingRef={isGeneratingRef}
                abortGenerateRef={abortGenerateRef}
                setConversationUpdateKey={setConversationUpdateKey}
              />
            </div>
          )
        }
      )}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: "100%"}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ChatMessagesDiv;
