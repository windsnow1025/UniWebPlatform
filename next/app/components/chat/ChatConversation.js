import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Snackbar, TextField, Button, ListItemButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {ConversationLogic} from "../../../src/logic/ConversationLogic";

function ChatConversation({ open, onClose, onConversationClick, conversation }) {
  const [conversations, setConversations] = useState([]);
  const [newConversationName, setNewConversationName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const conversations = await conversationLogic.fetchConversations();
      setConversations(conversations);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error fetching conversations');
      console.error(err);
    }
  };

  const handleAddConversation = async () => {
    try {
      await conversationLogic.addConversation({
        "name": newConversationName,
        "messages": JSON.stringify(conversation)
      });
      fetchConversations();
      setNewConversationName('');
      setAlertOpen(true);
      setAlertMessage('Conversation added');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error adding conversation');
      console.error(err);
    }
  };

  const handleUpdateConversation = async (index) => {
    try {
      await conversationLogic.updateConversation({
        "id": conversations[index].id,
        "name": editingName,
        "messages": JSON.stringify(conversation)
      });
      fetchConversations();
      setEditingIndex(null);
      setEditingName('');
      setAlertOpen(true);
      setAlertMessage('Conversation updated');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error updating conversation');
      console.error(err);
    }
  };

  const handleDeleteConversation = async (index) => {
    try {
      await conversationLogic.deleteConversation(conversations[index].id);
      fetchConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation deleted');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error deleting conversation');
      console.error(err);
    }
  };

  return (
    <Drawer variant="persistent" anchor="left" open={open} onClose={onClose}>
      <div style={{ width: 250 }}>
        <List>
          {conversations.map((conversation, index) => (
            <ListItem key={conversation.id}>
              <ListItemButton onClick={() => onConversationClick(conversation)}>
                {editingIndex === index ? (
                  <TextField
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleUpdateConversation(index)}
                    autoFocus
                  />
                ) : (
                  <ListItemText primary={conversation.name} />
                )}
              </ListItemButton>
              <IconButton onClick={(e) => { e.stopPropagation(); setEditingIndex(index); }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteConversation(index); }}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <div style={{ padding: 16 }}>
          <TextField
            label="New Conversation"
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddConversation}
            fullWidth
            style={{ marginTop: 8 }}
          >
            Add
          </Button>
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </Drawer>
  );
}

export default ChatConversation;