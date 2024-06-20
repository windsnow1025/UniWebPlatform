import React, {useEffect, useState} from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Save as SaveIcon,
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import {ConversationLogic} from "../../../src/logic/ConversationLogic";
import {UserLogic} from "../../../src/logic/UserLogic";

function ChatConversation({messages, setMessages}) {
  const [conversations, setConversations] = useState([]);
  const [newConversationName, setNewConversationName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  const conversationLogic = new ConversationLogic();
  const userLogic = new UserLogic();

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
      console.error(err);
    }
  };

  const fetchUsernames = async () => {
    try {
      setUsernames(await userLogic.fetchUsernames());
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error fetching usernames');
      console.error(err);
    }
  };

  const handleConversationClick = (conversationMessages) => {
    const messagesCopy = JSON.parse(JSON.stringify(conversationMessages));
    setMessages(messagesCopy);
  }

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
        messages: JSON.stringify(messages)
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
      fetchConversations();
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

  const handleShareConversation = async () => {
    try {
      await conversationLogic.addUserToConversation(conversations[selectedConversationIndex].id, selectedUsername);
      fetchConversations();
      setShareDialogOpen(false);
      setSelectedUsername('');
      setAlertOpen(true);
      setAlertMessage('Conversation shared');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error sharing conversation');
      console.error(err);
    }
  };

  const openShareDialog = async (index) => {
    setSelectedConversationIndex(index);
    await fetchUsernames();
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

  return (
    <>
      <div>
        <div className="p-4">
          <Typography variant="h6">Conversations:</Typography>
        </div>
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
                    <EditIcon/>
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="More">
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, index);
                }}>
                  <MoreVertIcon/>
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
                  <SaveIcon className="m-1"/>Update
                </MenuItem>
                <MenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(index);
                  handleMenuClose();
                }}>
                  <DeleteOutlinedIcon className="m-1"/>Delete
                </MenuItem>
                <MenuItem onClick={(e) => {
                  e.stopPropagation();
                  openShareDialog(index);
                  handleMenuClose();
                }}>
                  <ShareIcon className="m-1"/>Share
                </MenuItem>
              </Menu>
            </ListItem>
          ))}
        </List>
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
              startIcon={<AddIcon/>}
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
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share Conversation</DialogTitle>
        <DialogContent>
          <div className="m-2">
            <Autocomplete
              options={usernames}
              getOptionLabel={(option) => option}
              value={selectedUsername}
              onChange={(event, newValue) => setSelectedUsername(newValue)}
              renderInput={(params) => <TextField {...params} label="Username"/>}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleShareConversation}>Share</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChatConversation;