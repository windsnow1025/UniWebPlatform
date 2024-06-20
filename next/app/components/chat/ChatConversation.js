import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  TextField,
  Button,
  ListItemButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  Save as SaveIcon,
  SaveOutlined as SaveOutlinedIcon,
} from '@mui/icons-material';
import { ConversationLogic } from "../../../src/logic/ConversationLogic";

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
      setConversations(await conversationLogic.fetchConversations());
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error fetching conversations');
      console.error(err);
    }
  };

  const handleAddConversation = async () => {
    try {
      await conversationLogic.addConversation({
        name: newConversationName,
        messages: JSON.stringify(conversation)
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
        id: conversations[index].id,
        name: conversations[index].name,
        messages: JSON.stringify(conversation)
      });
      fetchConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation updated');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error updating conversation');
      console.error(err);
    }
  };

  const handleUpdateConversationName = async (index) => {
    try {
      const updatedConversation = await conversationLogic.updateConversationName(conversations[index].id, editingName);
      setConversations((prevConversations) => {
        const newConversations = [...prevConversations];
        newConversations[index] = updatedConversation;
        return newConversations;
      });
      setEditingIndex(null);
      setEditingName('');
      setAlertOpen(true);
      setAlertMessage('Conversation name updated');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error updating conversation name');
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
                    autoFocus
                  />
                ) : (
                  <ListItemText primary={conversation.name} />
                )}
              </ListItemButton>
              {editingIndex === index ? (
                <Tooltip title="Save">
                  <IconButton onClick={(e) => { e.stopPropagation(); handleUpdateConversationName(index); }}>
                    <SaveOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Rename">
                  <IconButton onClick={(e) => { e.stopPropagation(); setEditingIndex(index); setEditingName(conversation.name); }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Update">
                <IconButton onClick={(e) => { e.stopPropagation(); handleUpdateConversation(index); }}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteConversation(index); }}>
                  <DeleteOutlinedIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <div className="px-4 py-2">
          <TextField
            label="New Conversation"
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            fullWidth
          />
          <div className="my-2">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddConversation}
              fullWidth
            >
              Add
            </Button>
          </div>
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