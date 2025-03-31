import React, { useState } from 'react';
import { Alert, Button, CircularProgress, Snackbar, TextField } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import ConversationLogic from "../../../../src/conversation/ConversationLogic";

function SaveConversation({
                            messages,
                            setSelectedConversationId,
                            setConversations
                          }) {
  const [isToSaveConversation, setIsToSaveConversation] = useState(false);
  const [isSavingConversation, setIsSavingConversation] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const conversationLogic = new ConversationLogic();

  const fetchConversations = async () => {
    const newConversations = await conversationLogic.fetchConversations();
    setConversations(newConversations);
    return newConversations;
  };

  const handleAddConversation = () => {
    setIsToSaveConversation(true);
  };

  const handleSaveNewConversation = async () => {
    if (newConversationName.trim() === '') {
      setAlertOpen(true);
      setAlertMessage('Conversation name cannot be empty');
      setAlertSeverity('warning');
      return;
    }

    setIsSavingConversation(true);
    try {
      const newConversation = await conversationLogic.addConversation({
        name: newConversationName,
        messages: messages
      });
      await fetchConversations();

      setSelectedConversationId(newConversation.id);
      setNewConversationName('');
      setIsToSaveConversation(false);

      setAlertOpen(true);
      setAlertMessage('Conversation added');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error adding conversation');
      setAlertSeverity('error');
      console.error(err);
    } finally {
      setIsSavingConversation(false);
    }
  };

  const handleCancelAddConversation = () => {
    setIsToSaveConversation(false);
    setNewConversationName('');
  };

  if (!isToSaveConversation) {
    return (
      <>
        <Button
          variant="outlined"
          onClick={handleAddConversation}
          fullWidth
        >
          Save Conversation
        </Button>

        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={() => setAlertOpen(false)}
        >
          <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <div>
        <TextField
          label="Enter conversation name"
          value={newConversationName}
          onChange={(e) => setNewConversationName(e.target.value)}
          fullWidth
        />
        <div className="my-2 flex-around">
          <Button
            variant="outlined"
            startIcon={isSavingConversation ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSaveNewConversation}
            disabled={isSavingConversation || newConversationName.trim() === ''}
          >
            {isSavingConversation ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancelAddConversation}
            disabled={isSavingConversation}
          >
            Cancel
          </Button>
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
    </>
  );
}

export default SaveConversation;