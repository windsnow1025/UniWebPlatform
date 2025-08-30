import React, {useState, useEffect} from 'react';
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
  Chip,
  Collapse,
  Box,
  Divider,
} from '@mui/material';
import {
  DeleteOutlined as DeleteOutlinedIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  LabelOutlined as LabelOutlinedIcon,
} from '@mui/icons-material';
import ShareConversationDialog from './ShareConversationDialog';
import ConversationLogic from "../../../lib/conversation/ConversationLogic";
import FileLogic from "../../../lib/common/file/FileLogic";
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
                            setIsTemporaryChat,
                            isGeneratingRef,
                            handleGenerateRef,
                          }) {
  const LABEL_OPTIONS = [
    { key: undefined, name: 'No label', color: '#9e9e9e' },
    { key: 'red', name: 'Red', color: '#ef5350' },
    { key: 'orange', name: 'Orange', color: '#ffa726' },
    { key: 'yellow', name: 'Yellow', color: '#ffee58' },
    { key: 'green', name: 'Green', color: '#66bb6a' },
    { key: 'blue', name: 'Blue', color: '#42a5f5' },
    { key: 'purple', name: 'Purple', color: '#ab47bc' },
    { key: 'gray', name: 'Gray', color: '#bdbdbd' },
  ];
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

  // Auth state
  const [signedIn, setSignedIn] = useState(false);

  // Group collapse state per label
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setSignedIn(!!token);
    if (!token) {
      setIsLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    if (!signedIn) {
      return;
    }
    loadConversations();
  }, [conversationLoadKey, signedIn]);

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
    if (isGeneratingRef && isGeneratingRef.current && handleGenerateRef.current) {
      handleGenerateRef.current();
    }

    setLoadingConversationId(conversationId);

    const conversations = await loadConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    const messagesCopy = JSON.parse(JSON.stringify(conversation.messages));

    setIsTemporaryChat(false);
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

  const updateConversationColorLabel = async (index, colorLabel) => {
    const conversationId = conversations[index].id;
    setLoadingConversationId(conversationId);
    try {
      const updatedConversation = await conversationLogic.updateConversationColorLabel(conversationId, colorLabel);
      setConversations((prevConversations) => {
        const newConversations = [...prevConversations];
        newConversations[index] = updatedConversation;
        return newConversations;
      });
      setAlertOpen(true);
      setAlertMessage('Conversation label updated');
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

    if (conversationId === selectedConversationId && isGeneratingRef && isGeneratingRef.current && handleGenerateRef.current) {
      handleGenerateRef.current();
    }

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

    if (conversationId === selectedConversationId) {
      setSelectedConversationId(null);
      setMessages(null);
    }
    setLoadingConversationId(null);
  };

  if (isLoadingConversations && conversations.length === 0) {
    return (
      <div className="local-scroll-scrollable flex-center p-4">
        <CircularProgress/>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="local-scroll-scrollable flex-center p-4">
        <Typography variant="body2" color="text.secondary">Sign in to view conversations</Typography>
      </div>
    );
  }

  const colorForLabel = (label) => {
    if (label && label !== 'No label') {
      return LABEL_OPTIONS.find(o => o.key === label).color;
    } else {
      return LABEL_OPTIONS.find(o => o.key === undefined).color;
    }
  };

  const nameForLabel = (label) => {
    if (label && label !== 'No label') {
      return LABEL_OPTIONS.find(o => o.key === label).name;
    } else {
      return LABEL_OPTIONS.find(o => o.key === undefined).name;
    }
  };

  // Group conversations by colorLabel
  const groups = conversations.reduce((acc, conv, idx) => {
    const key = conv.colorLabel || 'No label';
    if (!acc[key]) acc[key] = [];
    acc[key].push({ conv, idx });
    return acc;
  }, {});
  const groupKeys = Object.keys(groups);

  const toggleGroup = (key) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <List className="local-scroll-scrollable">
        {groupKeys.map((key) => (
          <div key={`group-${key}`}>
            <ListItem
              disablePadding
              sx={{ bgcolor: 'background.paper' }}
            >
              <ListItemButton onClick={() => toggleGroup(key)}>
                <div className="flex-center w-full gap-2">
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colorForLabel(key)}} />
                  <Typography variant="subtitle2" className="flex-1">
                    {nameForLabel(key)} ({groups[key].length})
                  </Typography>
                  {collapsedGroups[key] ? <ExpandMoreIcon fontSize="small"/> : <ExpandLessIcon fontSize="small"/>}
                </div>
              </ListItemButton>
            </ListItem>
            <Collapse in={!collapsedGroups[key]}>
              {groups[key].map(({ conv, idx }) => (
                <ListItem dense
                  key={conv.id}
                  disablePadding
                  sx={{
                    bgcolor: conv.id === selectedConversationId ? 'action.selected' : 'inherit',
                  }}
                >
                  <ListItemButton onClick={() => selectConversation(conv.id)}>
                    {editingIndex === idx ? (
                      <TextField
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex-start-center-nowrap w-full">
                        <LabelOutlinedIcon
                          fontSize="small"
                          sx={{ color: colorForLabel(conv.colorLabel), mr: 2 }}
                        />
                        <ListItemText
                          primary={conv.name}
                          secondary={(
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              {formatDate(conv.updatedAt)}
                            </Typography>
                          )}
                        />
                        {loadingConversationId === conv.id && (
                          <CircularProgress size={20} sx={{ml: 1}}/>
                        )}
                      </div>
                    )}
                    {editingIndex === idx ? (
                      <Tooltip title="Save">
                        <IconButton onClick={(e) => {
                          e.stopPropagation();
                          updateConversationName(idx, editingName);
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
                          setEditingIndex(idx);
                          setEditingName(conv.name);
                        }}>
                          <EditIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="More">
                      <IconButton onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, idx);
                      }}>
                        <MoreVertIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                  </ListItemButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuIndex === idx}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>Set label</MenuItem>
                    {LABEL_OPTIONS.map((opt) => (
                      <MenuItem dense key={`lbl-${String(opt.key)}`} onClick={(e) => {
                        e.stopPropagation();
                        updateConversationColorLabel(idx, opt.key);
                        handleMenuClose();
                      }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: opt.color, mr: 1 }} />
                        {opt.name}
                      </MenuItem>
                    ))}
                    <Divider/>
                    <MenuItem onClick={(e) => {
                      e.stopPropagation();
                      openShareDialog(idx);
                      handleMenuClose();
                    }}>
                      <ShareIcon fontSize="small" className="mr-1"/>
                      Share
                    </MenuItem>
                    <MenuItem onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(idx);
                      handleMenuClose();
                    }}>
                      <DeleteOutlinedIcon fontSize="small" className="mr-1"/>
                      Delete
                    </MenuItem>
                  </Menu>
                </ListItem>
              ))}
            </Collapse>
          </div>
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
