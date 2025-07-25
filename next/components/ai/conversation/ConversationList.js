import React, {useState, useEffect} from 'react';
import {
  Alert,
  Button,
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
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import ShareConversationDialog from './ShareConversationDialog';
import ConversationLogic from "../../../lib/conversation/ConversationLogic";
import FileLogic from "../../../lib/common/file/FileLogic";
import {ContentTypeEnum} from "../../../client";
import {isEqual} from 'lodash';
import ChatLogic from "../../../lib/chat/ChatLogic";

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
                            setMessages,
                            conversationLoadKey,
                          }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Share dialog state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);

  // Loading state
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [loadingConversationId, setLoadingConversationId] = useState(null);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');


  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    loadConversations();
  }, [conversationLoadKey]);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const updatedTimes = await conversationLogic.fetchConversationUpdatedTimes();

      const currentMetadata = conversations.map(conv => ({id: conv.id, updatedAt: conv.updatedAt}));
      if (isEqual(updatedTimes, currentMetadata)) {
        return conversations;
      }

      const newConversations = await conversationLogic.fetchConversations();
      setConversations(newConversations);
      return newConversations;
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      console.error(err);
    }
    setIsLoadingConversations(false);
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

  const selectConversation = async (conversationId) => {
    setLoadingConversationId(conversationId);

    const conversations = await loadConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    const messagesCopy = JSON.parse(JSON.stringify(conversation.messages));
    setMessages(messagesCopy);

    setLoadingConversationId(null);

    setSelectedConversationId(conversationId);
  };

  const updateConversationName = async (index, newName) => {
    const conversationId = conversations[index].id;

    setLoadingConversationId(conversationId);

    try {
      const updatedConversation = await conversationLogic.updateConversationName(conversationId, newName);
      setConversations((prevConversations) => {
        const newConversations = [...prevConversations];
        newConversations[index] = updatedConversation;
        return newConversations;
      });
      setAlertOpen(true);
      setAlertMessage('Conversation name updated');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      console.error(err);
    }

    setLoadingConversationId(null);
  };

  const deleteConversation = async (index) => {
    const conversationId = conversations[index].id;

    setLoadingConversationId(conversationId);

    try {
      // Find files in the conversation
      const conversation = await conversationLogic.fetchConversation(conversationId);
      let fileUrls = [];
      if (conversation) {
        fileUrls = ChatLogic.getFileUrlsFromMessages(conversation.messages);
      }

      // Delete the conversation
      await conversationLogic.deleteConversation(conversationId);

      // Delete the files from storage
      if (fileUrls.length > 0) {
        try {
          const fileNames = FileLogic.getFileNamesFromUrls(fileUrls);
          const fileLogic = new FileLogic();
          await fileLogic.deleteFiles(fileNames);
        } catch (fileError) {
          console.error('Failed to delete files from conversation:', fileError);
        }
      }

      await loadConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation deleted');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      console.error(err);
    }

    setSelectedConversationId(null);
    setMessages(null);
    setLoadingConversationId(null);
  };

  if (isLoadingConversations && conversations.length === 0) {
    return (
      <div className="local-scroll-scrollable flex-center p-4">
        <CircularProgress/>
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
            <ListItemButton onClick={() => selectConversation(conversation.id)}>
              {editingIndex === index ? (
                <TextField
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  fullWidth
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="flex-start-center w-full">
                  <ListItemText
                    primary={conversation.name}
                    secondary={(
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {formatDate(conversation.updatedAt)}
                      </Typography>
                    )}
                  />
                  {loadingConversationId === conversation.id && (
                    <CircularProgress size={20} sx={{ml: 1}}/>
                  )}
                </div>
              )}
              {editingIndex === index ? (
                <Tooltip title="Save">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    updateConversationName(index, editingName);
                    setEditingIndex(null);
                    setEditingName('');
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
                deleteConversation(index);
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
