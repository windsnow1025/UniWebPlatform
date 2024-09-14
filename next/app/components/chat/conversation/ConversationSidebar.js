import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
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
  Typography,
} from '@mui/material';
import {
  DeleteOutlined as DeleteOutlinedIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import ConversationLogic from "../../../../src/conversation/ConversationLogic";
import ShareConversationDialog from './ShareConversationDialog';

function ConversationSidebar({messages, setMessages}) {
  const [conversations, setConversations] = useState([]);
  const [newConversationName, setNewConversationName] = useState('');

  // Conversation Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  // Edit Conversation Name
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Share Conversation
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const newConversations = await conversationLogic.fetchConversations();
      setConversations(newConversations);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error fetching conversations');
      setAlertSeverity('error');
      console.error(err);
    }
  };

  const handleConversationClick = (conversationMessages) => {
    const messagesCopy = JSON.parse(JSON.stringify(conversationMessages));
    setMessages(messagesCopy);
  };

  const handleAddConversation = async () => {
    try {
      await conversationLogic.addConversation({
        name: newConversationName,
        messages: JSON.stringify(messages)
      });
      fetchConversations();
      setNewConversationName('');
      setAlertOpen(true);
      setAlertMessage('Conversation added');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error adding conversation');
      setAlertSeverity('error');
      console.error(err);
    }
  };

  const handleUpdateConversation = async (index) => {
    try {
      await conversationLogic.updateConversation({
        id: conversations[index].id,
        name: conversations[index].name,
        messages: JSON.stringify(messages)
      });
      fetchConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation updated');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(`Error updating conversation: ${err}`);
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

  return (
    <div>
      <div>
        <div className="p-4 flex-between">
          <Typography variant="h6">Conversations</Typography>
          <Tooltip title="Refresh conversations">
            <IconButton onClick={handleRefreshConversations}>
              <RefreshIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        </div>
        <Divider/>
        <List>
          {conversations.map((conversation, index) => (
            <ListItem key={conversation.id} disablePadding>
              <ListItemButton onClick={() => handleConversationClick(conversation.messages)}>
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
              </ListItemButton>
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
              <Menu
                anchorEl={anchorEl}
                open={menuIndex === index}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateConversation(index);
                  handleMenuClose();
                }}>
                  <SaveIcon fontSize="small" className="m-1"/>Update
                </MenuItem>
                <MenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(index);
                  handleMenuClose();
                }}>
                  <DeleteOutlinedIcon fontSize="small" className="m-1"/>Delete
                </MenuItem>
                <MenuItem onClick={(e) => {
                  e.stopPropagation();
                  openShareDialog(index);
                  handleMenuClose();
                }}>
                  <ShareIcon fontSize="small" className="m-1"/>Share
                </MenuItem>
              </Menu>
            </ListItem>
          ))}
        </List>
        <Divider/>
        <div className="p-2">
          <TextField
            label="New Conversation"
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            fullWidth
          />
          <div className="my-2">
            <Button
              variant="outlined"
              startIcon={<SaveIcon/>}
              onClick={handleAddConversation}
              fullWidth
            >
              Save
            </Button>
          </div>
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