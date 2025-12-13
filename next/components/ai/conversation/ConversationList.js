import React, {useEffect, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  LabelOutlined as LabelOutlinedIcon,
  MoreVert as MoreVertIcon,
  SaveOutlined as SaveOutlinedIcon,
} from '@mui/icons-material';
import ConversationLogic from "../../../lib/conversation/ConversationLogic";
import {isEqual} from 'lodash';
import {COLOR_LABELS} from "./constants/ColorLabels";
import ConversationMenu from "./ConversationMenu";
import {StorageKeys} from "../../../lib/common/Constants";

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
                            setConversationLoadKey,
                            setIsTemporaryChat,
                            isGeneratingRef,
                            handleGenerateRef,
                          }) {
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  // Name editing state
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Loading state
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [loadingConversationId, setLoadingConversationId] = useState(null);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Auth state
  const [signedIn, setSignedIn] = useState(false);

  // Accordion expanded state
  const [expandedAccordion, setExpandedAccordion] = useState({});

  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    const token = localStorage.getItem(StorageKeys.Token);
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

  useEffect(() => {
    if (editingId == null) return;
    const exists = conversations.some(c => c.id === editingId);
    if (!exists) {
      setEditingId(null);
      setEditingName('');
    }
  }, [conversations, editingId]);

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
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
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

  const updateConversationName = async (conversationId, newName) => {
    const index = conversations.findIndex(convo => convo.id === conversationId);

    setLoadingConversationId(conversationId);

    try {
      const updatedConversation = await conversationLogic.updateConversationName(
        conversationId, conversations[index].version, newName
      );
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

  const handleSaveConversationName = (conversationId) => {
    updateConversationName(conversationId, editingName);
    setEditingId(null);
    setEditingName('');
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
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
      return COLOR_LABELS.find(o => o.key === label).color;
    } else {
      return COLOR_LABELS.find(o => o.key === '').color;
    }
  };

  const nameForLabel = (label) => {
    if (label && label !== 'No label') {
      return COLOR_LABELS.find(o => o.key === label).name;
    } else {
      return COLOR_LABELS.find(o => o.key === '').name;
    }
  };

  // Group conversations by colorLabel
  const groups = conversations.reduce((acc, conv, idx) => {
    const key = conv.colorLabel || 'No label';
    if (!acc[key]) acc[key] = [];
    acc[key].push({ conv, idx });
    return acc;
  }, {});
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => new Date(b.conv.updatedAt) - new Date(a.conv.updatedAt));
  });

  const groupKeys = Object.keys(groups);

  return (
    <>
      <div className="local-scroll-scrollable">
        <div className="local-scroll-unscrollable-y">
          {groupKeys.map((key) => (
            <Accordion
              key={`group-${key}`}
              expanded={expandedAccordion[key] !== false}
              onChange={handleAccordionChange(key)}
              disableGutters
              elevation={4}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'background.paper',
                }}
              >
                <div className="flex-center w-full gap-2">
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colorForLabel(key)}} />
                  <Typography variant="subtitle2" className="flex-1">
                    {nameForLabel(key)} ({groups[key].length})
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <List disablePadding>
                  {groups[key].map(({ conv, idx }) => (
                    <ListItem
                      dense
                      key={conv.id}
                      disablePadding
                      sx={{
                        bgcolor: conv.id === selectedConversationId ? 'action.selected' : 'inherit',
                      }}
                    >
                      <ListItemButton onClick={() => selectConversation(conv.id)}>
                        {editingId === conv.id ? (
                          <TextField
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                            fullWidth
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.stopPropagation();
                                handleSaveConversationName(conv.id);
                              }
                            }}
                            size="small"
                          />
                        ) : (
                          <div className="flex-start-center-nowrap w-full min-w-0">
                            <LabelOutlinedIcon
                              fontSize="small"
                              sx={{ color: colorForLabel(conv.colorLabel), mr: 2 }}
                            />
                            <ListItemText
                              primary={conv.name}
                              slotProps={{ primary: { noWrap: true } }}
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
                        {editingId === conv.id ? (
                          <Tooltip title="Save (Enter)">
                            <IconButton onClick={(e) => {
                              e.stopPropagation();
                              handleSaveConversationName(conv.id);
                            }}>
                              <SaveOutlinedIcon/>
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Rename">
                            <IconButton onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(conv.id);
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
                      <ConversationMenu
                        conversationIndex={idx}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        menuIndex={menuIndex}
                        setMenuIndex={setMenuIndex}
                        conversations={conversations}
                        setConversations={setConversations}
                        selectedConversationId={selectedConversationId}
                        setSelectedConversationId={setSelectedConversationId}
                        setMessages={setMessages}
                        setConversationLoadKey={setConversationLoadKey}
                        isGeneratingRef={isGeneratingRef}
                        handleGenerateRef={handleGenerateRef}
                        setLoadingConversationId={setLoadingConversationId}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
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

export default ConversationList;