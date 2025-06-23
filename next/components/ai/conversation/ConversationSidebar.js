import React, {useEffect, useState} from 'react';
import {
  Alert,
  Divider,
  Snackbar,
  Typography,
} from '@mui/material';
import ConversationLogic from "../../../lib/conversation/ConversationLogic";
import ConversationList from './ConversationList';
import SaveConversation from './SaveConversation';

function ConversationSidebar({
                               messages,
                               setMessages,
                               selectedConversationId,
                               setSelectedConversationId,
                               conversationUpdateKey,
                             }) {
  const [conversations, setConversations] = useState([]);
  const [conversationLoadKey, setConversationLoadKey] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const conversationLogic = new ConversationLogic();

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
    setSelectedConversationId(conversations[index].id);
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
    <div className="local-scroll-container">
      <div className="local-scroll-unscrollable-y">
        <div className="flex-between-nowrap p-4">
          <Typography variant="h6">
            Conversation
          </Typography>
        </div>
        <Divider/>

        <ConversationList
          conversations={conversations}
          setConversations={setConversations}
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          messages={messages}
          setMessages={setMessages}
          conversationLoadKey={conversationLoadKey}
          setConversationLoadKey={setConversationLoadKey}
        />

        <Divider/>
        <div className="p-2">
          <SaveConversation
            messages={messages}
            setSelectedConversationId={setSelectedConversationId}
            setConversations={setConversations}
            setConversationLoadKey={setConversationLoadKey}
          />
        </div>
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
    </div>
  );
}

export default ConversationSidebar;