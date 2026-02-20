import React, {useEffect, useState} from 'react';
import {Alert, Box, Divider, Snackbar,} from '@mui/material';
import ConversationList from './conversation-list/ConversationList';
import NewConversationButton from "./NewConversationButton";
import TemporaryChatButton from "../TemporaryChatButton";
import ConversationLogic from "../../../lib/conversation/ConversationLogic";

function ConversationSidebar({
                               messages,
                               setMessages,
                               selectedConversationId,
                               setSelectedConversationId,
                               conversationUpdateKey,
                               conversationUpdatePromiseRef,
                               conversationVersionRef,
                               conversations,
                               setConversations,
                               conversationsReloadKey,
                               setConversationsReloadKey,
                               setIsTemporaryChat,
                               isGeneratingRef,
                               abortGenerateRef,
                               clearUIStateRef,
                             }) {
  const conversationLogic = new ConversationLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }
    const conversationToUpdate = conversations.find(c => c.id === selectedConversationId);
    if (!conversationToUpdate) {
      return;
    }
    handleUpdateConversation(conversations.indexOf(conversationToUpdate));
  }, [conversationUpdateKey]);

  const getMessagesForUpdate = () => {
    const strippedMessages = ConversationLogic.stripPromptContents(messages);
    if (isGeneratingRef?.current && strippedMessages.length > 0) {
      const lastMessage = strippedMessages[strippedMessages.length - 1];
      if (lastMessage?.role === 'assistant') {
        return strippedMessages.slice(0, -1);
      }
    }
    return strippedMessages;
  };

  const handleUpdateConversation = async (index) => {
    const conversationId = conversations[index]?.id;
    if (!conversationId) return;

    // Skip reload for intermediate updates when multiple updates are queued
    let currentPromise;

    const updateConversation = async () => {
      try {
        const updatedConversation = await conversationLogic.updateConversation(
          conversationId,
          conversationVersionRef.current[conversationId] ?? conversations[index]?.version,
          {
            name: conversations[index].name,
            messages: getMessagesForUpdate()
          }
        );
        conversationVersionRef.current[updatedConversation.id] = updatedConversation.version;

        setConversations((prevConversations) => {
          const targetIndex = prevConversations.findIndex(c => c.id === conversationId);

          if (targetIndex === -1) {
            return prevConversations;
          }

          const newConversations = [...prevConversations];

          newConversations[targetIndex] = updatedConversation;

          return newConversations;
        });

        if (conversationUpdatePromiseRef.current === currentPromise) {
          setConversationsReloadKey(prev => prev + 1);
        }
      } catch (err) {
        setAlertOpen(true);
        setAlertMessage(err.message);
        setAlertSeverity('error');
      }
    };

    const previous = conversationUpdatePromiseRef.current ?? Promise.resolve();
    const updatePromise = previous
      .catch(() => {})
      .then(updateConversation);

    currentPromise = updatePromise;
    conversationUpdatePromiseRef.current = updatePromise;

    try {
      await updatePromise;
    } finally {
      if (conversationUpdatePromiseRef.current === updatePromise) {
        conversationUpdatePromiseRef.current = null;
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: {
          xs: '75vw',
          sm: '70vw',
          md: '35vw',
          lg: '30vw',
          xl: '25vw'
        }
      }}
      className="local-scroll-container"
    >
      <div className="local-scroll-unscrollable-y">
        <div className="py-2">
          <div className="w-full px-4 py-1">
            <TemporaryChatButton
              setMessages={setMessages}
              setSelectedConversationId={setSelectedConversationId}
              setIsTemporaryChat={setIsTemporaryChat}
              buttonStyle="sidebar"
              clearUIStateRef={clearUIStateRef}
            />
          </div>
          <div className="w-full px-4 py-1">
            <NewConversationButton
              setMessages={setMessages}
              setConversations={setConversations}
              setSelectedConversationId={setSelectedConversationId}
              setConversationsReloadKey={setConversationsReloadKey}
              setIsTemporaryChat={setIsTemporaryChat}
              buttonStyle="sidebar"
              clearUIStateRef={clearUIStateRef}
            />
          </div>
        </div>
        <Divider/>

        <ConversationList
          conversations={conversations}
          setConversations={setConversations}
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          setMessages={setMessages}
          conversationsReloadKey={conversationsReloadKey}
          setConversationsReloadKey={setConversationsReloadKey}
          setIsTemporaryChat={setIsTemporaryChat}
          abortGenerateRef={abortGenerateRef}
          clearUIStateRef={clearUIStateRef}
          conversationUpdatePromiseRef={conversationUpdatePromiseRef}
        />
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ConversationSidebar;
