import React, {useEffect, useState} from 'react';
import {
  Alert,
  Divider,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Forum as ForumIcon,
  Refresh as RefreshIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon
} from '@mui/icons-material';
import ConversationLogic from "../../../../src/conversation/ConversationLogic";
import ConversationList from './ConversationList';
import SaveConversation from './SaveConversation';

function ConversationSidebar({
                               messages,
                               setMessages,
                               selectedConversationId,
                               setSelectedConversationId,
                               conversationUpdateTrigger,
                               setConversationUpdateTrigger,
                             }) {
  const [conversations, setConversations] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Auto Update
  const [autoUpdate, setAutoUpdate] = useState(true);

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    if (autoUpdate && selectedConversationId && conversationUpdateTrigger) {
      const conversationToUpdate = conversations.find(c => c.id === selectedConversationId);
      if (conversationToUpdate) {
        handleUpdateConversation(conversations.indexOf(conversationToUpdate), false);
      }
    }
    setConversationUpdateTrigger(false);
  }, [conversationUpdateTrigger]);

  const fetchConversations = async () => {
    try {
      const newConversations = await conversationLogic.fetchConversations();
      setConversations(newConversations);
      return newConversations;
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error fetching conversations');
      setAlertSeverity('error');
      console.error(err);
      return [];
    }
  };

  const handleUpdateConversation = async (index, isManualUpdate = false) => {
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
      fetchConversations();

      if (isManualUpdate) {
        setAlertOpen(true);
        setAlertMessage('Conversation updated successfully');
        setAlertSeverity('success');
      }
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(`Error updating conversation: ${err.message}`);
      setAlertSeverity('error');
      console.error(err);
    }
  };

  const handleToggleAutoUpdate = () => {
    setAutoUpdate(!autoUpdate);
  };

  const handleRefresh = async () => {
    try {
      await fetchConversations();
      setAlertOpen(true);
      setAlertMessage('Conversations refreshed successfully');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error refreshing conversations');
      setAlertSeverity('error');
      console.error(err);
    }
  };

  return (
    <div className="local-scroll-container">
      <div className="local-scroll-unscrollable-y">
        <div className="flex-between-nowrap p-4">
          <div className="flex-center">
            <ForumIcon/>
            <Typography variant="subtitle1" sx={{ml: 1}}>
              Conversation
            </Typography>
          </div>
          <div className="flex-center">
            <Tooltip title={`${autoUpdate ? 'Disable' : 'Enable'} auto update`}>
              <IconButton onClick={handleToggleAutoUpdate}>
                {autoUpdate ? <SyncIcon fontSize="small"/> : <SyncDisabledIcon fontSize="small"/>}
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh conversations">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <Divider/>

        <ConversationList
          conversations={conversations}
          setConversations={setConversations}
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          messages={messages}
          setMessages={setMessages}
        />

        <Divider/>
        <div className="p-2">
          <SaveConversation
            messages={messages}
            setSelectedConversationId={setSelectedConversationId}
            setConversations={setConversations}
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