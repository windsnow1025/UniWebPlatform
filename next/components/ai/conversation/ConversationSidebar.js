import React, {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Divider,
  Snackbar,
} from '@mui/material';
import ConversationList from './ConversationList';
import NewConversationButton from "../NewConversationButton";
import TemporaryChatButton from "../TemporaryChatButton";
import ConversationLogic from "../../../lib/conversation/ConversationLogic";

function ConversationSidebar({
                               messages,
                               setMessages,
                               selectedConversationId,
                               setSelectedConversationId,
                               conversationUpdateKey,
                               conversations,
                               setConversations,
                               conversationLoadKey,
                               setConversationLoadKey,
                               setIsTemporaryChat,
                               isGeneratingRef,
                               handleGenerateRef,
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

  const handleUpdateConversation = async (index) => {
    try {
      const updatedConversation = await conversationLogic.updateConversation(
        conversations[index].id,
        {
          name: conversations[index].name,
          messages: messages
        }
      );
      setConversations((prevConversations) => {
        const newConversations = [...prevConversations];
        newConversations[index] = updatedConversation;
        return newConversations;
      });
      setConversationLoadKey(prev => prev + 1);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      console.error(err);
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
              size="small"
              isGeneratingRef={isGeneratingRef}
              handleGenerateRef={handleGenerateRef}
            />
          </div>
          <div className="w-full px-4 py-1">
            <NewConversationButton
              setMessages={setMessages}
              setConversations={setConversations}
              setSelectedConversationId={setSelectedConversationId}
              setConversationLoadKey={setConversationLoadKey}
              setIsTemporaryChat={setIsTemporaryChat}
              size="small"
              isGeneratingRef={isGeneratingRef}
              handleGenerateRef={handleGenerateRef}
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
          conversationLoadKey={conversationLoadKey}
          setConversationLoadKey={setConversationLoadKey}
          setIsTemporaryChat={setIsTemporaryChat}
          isGeneratingRef={isGeneratingRef}
          handleGenerateRef={handleGenerateRef}
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
