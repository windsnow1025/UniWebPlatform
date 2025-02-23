import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
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
} from '@mui/material';
import {
  DeleteOutlined as DeleteOutlinedIcon,
  Edit as EditIcon,
  Forum as ForumIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon
} from '@mui/icons-material';
import ConversationLogic from "../../../src/conversation/ConversationLogic";
import ShareConversationDialog from './ShareConversationDialog';

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

  // Loading state
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [isSavingConversation, setIsSavingConversation] = useState(false);

  // Conversation Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  // Edit Conversation Name
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Share Conversation
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);

  // Auto Update
  const [autoUpdate, setAutoUpdate] = useState(true);

  // Save conversation
  const [newConversationName, setNewConversationName] = useState('');
  const [isToSaveConversation, setIsToSaveConversation] = useState(false);

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (autoUpdate && selectedConversationId && conversationUpdateTrigger) {
      const conversationToUpdate = conversations.find(c => c.id === selectedConversationId);
      if (conversationToUpdate) {
        handleUpdateConversation(conversations.indexOf(conversationToUpdate), false);
      }
      setConversationUpdateTrigger(false);
    }
  }, [conversationUpdateTrigger]);

  const fetchConversations = async () => {
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

  const handleConversationClick = (conversationMessages, conversationId) => {
    const messagesCopy = JSON.parse(JSON.stringify(conversationMessages));
    setMessages(messagesCopy);
    setSelectedConversationId(conversationId);
  };

  const handleAddConversation = async () => {
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
  }

  const handleCancelAddConversation = () => {
    setIsToSaveConversation(false);
    setNewConversationName('');
  }

  const handleUpdateConversation = async (index, isManualUpdate = false) => {
    console.log("update conversation")
    try {
      const updatedConversation = await conversationLogic.updateConversation({
        id: conversations[index].id,
        name: conversations[index].name,
        messages: messages
      });
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

  const handleUpdateConversationName = async (index) => {
    try {
      const updatedConversation = await conversationLogic.updateConversationName(conversations[index].id, editingName);
      setConversations((prevConversations) => {
        const newConversations = [...prevConversations];
        newConversations[index] = updatedConversation;
        return newConversations;
      });
      fetchConversations();
      setEditingIndex(null);
      setEditingName('');
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
      fetchConversations();
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

  const openShareDialog = (index) => {
    setSelectedConversationIndex(index);
    setShareDialogOpen(true);
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleRefreshConversations = async () => {
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

  const handleToggleAutoUpdate = () => {
    setAutoUpdate(!autoUpdate);
  };

  return (
    <div className="local-scroll-container">
      <div className="local-scroll-unscrollable-y">
        <div className="flex-between-nowrap p-4">
          <div className="flex-center">
            <Tooltip title="Conversations">
              <ForumIcon/>
            </Tooltip>
            <Tooltip title={`${autoUpdate ? 'Disable' : 'Enable'} auto update`}>
              <IconButton onClick={handleToggleAutoUpdate}>
                {autoUpdate ? <SyncIcon fontSize="small"/> : <SyncDisabledIcon fontSize="small"/>}
              </IconButton>
            </Tooltip>
          </div>
          <Tooltip title="Refresh conversations">
            <IconButton onClick={handleRefreshConversations}>
              <RefreshIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        </div>
        <Divider/>
        {(isLoadingConversation && conversations.length === 0) ? (
          <div className="local-scroll-scrollable flex-center p-4">
            <CircularProgress/>
          </div>
        ) : (
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
                    <ListItemText primary={conversation.name}/>
                  )}
                  {editingIndex === index ? (
                    <Tooltip title="Save">
                      <IconButton onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateConversationName(index);
                      }}>
                        <SaveOutlinedIcon/>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Rename">
                      <IconButton onClick={(e) => {
                        e.stopPropagation();
                        setEditingIndex(index);
                        setEditingName(conversation.name);
                      }}>
                        <EditIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="More">
                    <IconButton onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, index);
                    }}>
                      <MoreVertIcon fontSize="small"/>
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
                    <SaveIcon fontSize="small" className="m-1"/>
                    Update
                  </MenuItem>
                  <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(index);
                    handleMenuClose();
                  }}>
                    <DeleteOutlinedIcon fontSize="small" className="m-1"/>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    openShareDialog(index);
                    handleMenuClose();
                  }}>
                    <ShareIcon fontSize="small" className="m-1"/>
                    Share
                  </MenuItem>
                </Menu>
              </ListItem>
            ))}
          </List>
        )}
        <Divider/>
        <div className="p-2">
          {!isToSaveConversation && (
            <Button
              variant="outlined"
              onClick={handleAddConversation}
              fullWidth
            >
              Save Conversation
            </Button>
          )}
          {isToSaveConversation && (
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
                  startIcon={isSavingConversation ? <CircularProgress size={20}/> : <SaveIcon/>}
                  onClick={handleSaveNewConversation}
                  disabled={isSavingConversation}
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
          )}
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
      <ShareConversationDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        conversationId={conversations[selectedConversationIndex]?.id}
      />
    </div>
  );
}

export default ConversationSidebar;