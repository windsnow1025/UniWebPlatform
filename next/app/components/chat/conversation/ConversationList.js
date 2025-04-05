import React, { useState, useEffect } from 'react';
import {
  Alert,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DeleteOutlined as DeleteOutlinedIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Save as SaveIcon,
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import ShareConversationDialog from './ShareConversationDialog';
import ConversationLogic from "../../../../src/conversation/ConversationLogic";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = Math.max(0, now - date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return diffMins <= 0 ? 'Just now' : `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

function ConversationList({
                            conversations,
                            setConversations,
                            selectedConversationId,
                            setSelectedConversationId,
                            messages,
                            setMessages,
                          }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Share dialog state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);

  // Loading state
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoadingConversation(true);
    try {
      const newConversations = await conversationLogic.fetchConversations();
      setConversations(newConversations);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error fetching conversations');
      setAlertSeverity('error');
      console.error(err);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const openShareDialog = (index) => {
    setSelectedConversationIndex(index);
    setShareDialogOpen(true);
  };

  const handleConversationClick = (conversationMessages, conversationId) => {
    const messagesCopy = JSON.parse(JSON.stringify(conversationMessages));
    setMessages(messagesCopy);
    setSelectedConversationId(conversationId);
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
      await loadConversations();

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

  const handleUpdateConversationName = async (index, newName) => {
    try {
      const updatedConversation = await conversationLogic.updateConversationName(conversations[index].id, newName);
      setConversations((prevConversations) => {
        const newConversations = [...prevConversations];
        newConversations[index] = updatedConversation;
        return newConversations;
      });
      await loadConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation name updated');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error updating conversation name');
      setAlertSeverity('error');
      console.error(err);
    }
  };

  const handleDeleteConversation = async (index) => {
    try {
      await conversationLogic.deleteConversation(conversations[index].id);
      await loadConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation deleted');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error deleting conversation');
      setAlertSeverity('error');
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    try {
      await loadConversations();
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

  if (isLoadingConversation && conversations.length === 0) {
    return (
      <div className="local-scroll-scrollable flex-center p-4">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <List className="local-scroll-scrollable">
        {conversations.map((conversation, index) => (
          <ListItem
            key={conversation.id}
            disablePadding
            sx={{
              bgcolor: conversation.id === selectedConversationId ? 'action.selected' : 'inherit',
            }}
          >
            <ListItemButton onClick={() => handleConversationClick(conversation.messages, conversation.id)}>
              {editingIndex === index ? (
                <TextField
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  fullWidth
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div style={{ width: '100%' }}>
                  <ListItemText 
                    primary={conversation.name} 
                    secondary={(
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(conversation.updatedAt)}
                      </Typography>
                    )}
                  />
                </div>
              )}
              {editingIndex === index ? (
                <Tooltip title="Save">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateConversationName(index, editingName);
                    setEditingIndex(null);
                    setEditingName('');
                  }}>
                    <SaveOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Rename">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    setEditingIndex(index);
                    setEditingName(conversation.name);
                  }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="More">
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, index);
                }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItemButton>
            <Menu
              anchorEl={anchorEl}
              open={menuIndex === index}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={(e) => {
                e.stopPropagation();
                handleUpdateConversation(index, true);
                handleMenuClose();
              }}>
                <SaveIcon fontSize="small" className="m-1" />
                Update
              </MenuItem>
              <MenuItem onClick={(e) => {
                e.stopPropagation();
                handleDeleteConversation(index);
                handleMenuClose();
              }}>
                <DeleteOutlinedIcon fontSize="small" className="m-1" />
                Delete
              </MenuItem>
              <MenuItem onClick={(e) => {
                e.stopPropagation();
                openShareDialog(index);
                handleMenuClose();
              }}>
                <ShareIcon fontSize="small" className="m-1" />
                Share
              </MenuItem>
            </Menu>
          </ListItem>
        ))}
      </List>

      <ShareConversationDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        conversationId={conversations[selectedConversationIndex]?.id}
      />

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

export default ConversationList;