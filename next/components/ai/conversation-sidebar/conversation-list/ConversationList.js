import React, {useEffect, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
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
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  LabelOutlined as LabelOutlinedIcon,
  MoreVert as MoreVertIcon,
  SaveOutlined as SaveOutlinedIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import ConversationLogic from "../../../../lib/conversation/ConversationLogic";
import SystemPromptLogic from "../../../../lib/system-prompt/SystemPromptLogic";
import LabelLogic from "../../../../lib/label/LabelLogic";
import {isEqual} from 'lodash';
import {NO_LABEL_COLOR, PRESET_COLORS} from "./label/PresetColors";
import ConversationMenu from "./menu/ConversationMenu";
import {StorageKeys} from "../../../../lib/common/Constants";
import ConfirmDialog from "../../../common/ConfirmDialog";
import ColorDot from "./label/ColorDot";
import ColorPicker from "./label/ColorPicker";

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
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  // Accordion expanded state
  const [expandedAccordion, setExpandedAccordion] = useState({});

  // Auth state
  const [signedIn, setSignedIn] = useState(false);

  // Conversation name editing state
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingConversationName, setEditingConversationName] = useState('');

  // Labels state
  const [labels, setLabels] = useState([]);

  // New label state
  const [newLabelExpanded, setNewLabelExpanded] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(PRESET_COLORS[1]);
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  // Edit label state
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelName, setEditingLabelName] = useState('');
  const [editingLabelColor, setEditingLabelColor] = useState('');

  // Loading state
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [loadingConversationId, setLoadingConversationId] = useState(null);
  const [isLoadingLabels, setIsLoadingLabels] = useState(false);

  // Delete label confirmation state
  const [deleteLabelId, setDeleteLabelId] = useState(null);
  const [deleteLabelName, setDeleteLabelName] = useState('');

  const conversationLogic = new ConversationLogic();
  const systemPromptLogic = new SystemPromptLogic();
  const labelLogic = new LabelLogic();

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
    loadLabels();
  }, [conversationLoadKey, signedIn]);

  useEffect(() => {
    if (editingConversationId == null) return;
    const exists = conversations.some(conversation => conversation.id === editingConversationId);
    if (!exists) {
      setEditingConversationId(null);
      setEditingConversationName('');
    }
  }, [conversations, editingConversationId]);

  const loadLabels = async () => {
    setIsLoadingLabels(true);
    try {
      const fetchedLabels = await labelLogic.fetchLabels();
      setLabels(fetchedLabels || []);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
    } finally {
      setIsLoadingLabels(false);
    }
  };

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const updatedTimes = await conversationLogic.fetchConversationUpdatedTimes();

      const currentMetadata = conversations.map(conv => ({id: conv.id, updatedAt: conv.updatedAt}));
      if (isEqual(updatedTimes, currentMetadata)) {
        return JSON.parse(JSON.stringify(conversations));
      }

      const newConversations = await conversationLogic.fetchConversations();
      setConversations(newConversations);
      return JSON.parse(JSON.stringify(newConversations));
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
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
    const conversation = conversations.find(conversation => conversation.id === conversationId);
    const messages = conversation.messages;

    // Fetch System Prompt
    for (const message of messages) {
      if (message.systemPromptId) {
        try {
          const systemPrompt = await systemPromptLogic.fetchSystemPrompt(message.systemPromptId);
          message.contents = systemPrompt.contents;
        } catch (err) {
          setAlertOpen(true);
          setAlertMessage(err.message);
          setAlertSeverity('error');
        }
      }
    }

    setIsTemporaryChat(false);
    setMessages(messages);
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
    }

    setLoadingConversationId(null);
  };

  const handleSaveConversationName = (conversationId) => {
    updateConversationName(conversationId, editingConversationName);
    setEditingConversationId(null);
    setEditingConversationName('');
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
  };

  // Label management functions
  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) {
      setAlertOpen(true);
      setAlertMessage('Label name is required');
      setAlertSeverity('warning');
      return;
    }

    setIsCreatingLabel(true);
    try {
      const createdLabel = await labelLogic.createLabel(newLabelName.trim(), newLabelColor);
      setLabels(prev => [...prev, createdLabel]);
      setNewLabelName('');
      setNewLabelColor(PRESET_COLORS[1]);
      setNewLabelExpanded(false);
      setAlertOpen(true);
      setAlertMessage('Label created');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
    } finally {
      setIsCreatingLabel(false);
    }
  };

  const handleUpdateLabel = async (labelId) => {
    if (!editingLabelName.trim()) {
      setAlertOpen(true);
      setAlertMessage('Label name is required');
      setAlertSeverity('warning');
      return;
    }

    try {
      const updatedLabel = await labelLogic.updateLabel(labelId, editingLabelName.trim(), editingLabelColor);
      setLabels(prev => prev.map(l => l.id === labelId ? updatedLabel : l));
      setEditingLabelId(null);
      setEditingLabelName('');
      setEditingLabelColor('');
      setAlertOpen(true);
      setAlertMessage('Label updated');
      setAlertSeverity('success');
      // Refresh conversations to update label references
      setConversationLoadKey(prev => prev + 1);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
    }
  };

  const openDeleteLabelConfirm = (labelId, labelName) => {
    setDeleteLabelId(labelId);
    setDeleteLabelName(labelName);
  };

  const closeDeleteLabelConfirm = () => {
    setDeleteLabelId(null);
    setDeleteLabelName('');
  };

  const confirmDeleteLabel = async () => {
    if (!deleteLabelId) return;
    try {
      await labelLogic.deleteLabel(deleteLabelId);
      setLabels(prev => prev.filter(l => l.id !== deleteLabelId));
      setAlertOpen(true);
      setAlertMessage('Label deleted');
      setAlertSeverity('success');
      // Refresh conversations as deleted label sets conversations to null
      setConversationLoadKey(prev => prev + 1);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
    } finally {
      closeDeleteLabelConfirm();
    }
  };

  const isInitialLoading =
    (isLoadingConversations && conversations.length === 0) ||
    (isLoadingLabels && labels.length === 0);

  if (isInitialLoading) {
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

  // Group conversations by label.id
  const groups = conversations.reduce((acc, conv, idx) => {
    const key = conv.label?.id ?? 'no-label';
    if (!acc[key]) acc[key] = [];
    acc[key].push({conv, idx});
    return acc;
  }, {});
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => new Date(b.conv.updatedAt) - new Date(a.conv.updatedAt));
  });

  // Build ordered group keys: labels first, then 'no-label'
  const labelIds = labels.map(l => l.id);
  const groupKeys = [...labelIds.filter(id => groups[id]), ...(groups['no-label'] ? ['no-label'] : [])];

  const getLabelInfo = (key) => {
    if (key === 'no-label') {
      return {name: 'No label', color: NO_LABEL_COLOR};
    }
    const label = labels.find(l => l.id === key);
    return label ? {name: label.name, color: label.color} : {name: 'Unknown', color: NO_LABEL_COLOR};
  };

  return (
    <>
      <div className="local-scroll-scrollable">
        <div className="local-scroll-unscrollable-y">
          {/* New Label Accordion */}
          <Accordion
            expanded={newLabelExpanded}
            onChange={(e, expanded) => setNewLabelExpanded(expanded)}
            disableGutters
            elevation={4}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              sx={{backgroundColor: 'background.paper'}}
            >
              <div className="flex-center w-full gap-2">
                <AddIcon fontSize="small"/>
                <Typography variant="subtitle2" className="flex-1">
                  New Label
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                <TextField
                  size="small"
                  placeholder="Label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newLabelName.trim()) {
                      e.stopPropagation();
                      handleCreateLabel();
                    }
                  }}
                  fullWidth
                />
                <ColorPicker
                  color={newLabelColor}
                  setColor={setNewLabelColor}
                  size={24}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCreateLabel}
                  disabled={isCreatingLabel || !newLabelName.trim()}
                >
                  {isCreatingLabel ? <CircularProgress size={16}/> : 'Create'}
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Box sx={{mb: 1}}/>
          {/* Label Groups */}
          {groupKeys.map((key) => {
            const labelInfo = getLabelInfo(key);
            const isEditingThisLabel = editingLabelId === key;

            return (
              <Accordion
                key={`group-${key}`}
                expanded={expandedAccordion[key] !== false}
                onChange={handleAccordionChange(key)}
                disableGutters
                elevation={4}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                  sx={{backgroundColor: 'background.paper'}}
                >
                  <div className="flex-center w-full">
                    {isEditingThisLabel ? (
                      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 1}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                          <TextField
                            size="small"
                            value={editingLabelName}
                            onChange={(e) => setEditingLabelName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{flex: 1}}
                          />
                          <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateLabel(key);
                          }}>
                            <SaveOutlinedIcon fontSize="small"/>
                          </IconButton>
                        </Box>
                        <ColorPicker
                          color={editingLabelColor}
                          setColor={setEditingLabelColor}
                          size={20}
                          stopPropagation={true}
                        />
                      </Box>
                    ) : (
                      <>
                        <ColorDot color={labelInfo.color} sx={{mr: 2}}/>
                        <Typography variant="subtitle2" className="flex-1">
                          {labelInfo.name} ({groups[key]?.length || 0})
                        </Typography>
                        {key !== 'no-label' && (
                          <>
                            <Tooltip title="Edit label">
                              <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                setEditingLabelId(key);
                                setEditingLabelName(labelInfo.name);
                                setEditingLabelColor(labelInfo.color);
                              }}>
                                <SettingsIcon fontSize="small"/>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete label">
                              <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                openDeleteLabelConfirm(key, labelInfo.name);
                              }}>
                                <DeleteIcon fontSize="small"/>
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{padding: 0}}>
                  <List disablePadding>
                    {groups[key]?.map(({conv, idx}) => (
                      <ListItem
                        dense
                        key={conv.id}
                        disablePadding
                        sx={{
                          bgcolor: conv.id === selectedConversationId ? 'action.selected' : 'inherit',
                        }}
                      >
                        <ListItemButton onClick={() => selectConversation(conv.id)}>
                          {editingConversationId === conv.id ? (
                            <TextField
                              value={editingConversationName}
                              onChange={(e) => setEditingConversationName(e.target.value)}
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
                                sx={{color: conv.label?.color || NO_LABEL_COLOR, mr: 2}}
                              />
                              <ListItemText
                                primary={conv.name}
                                slotProps={{primary: {noWrap: true}}}
                                secondary={(
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap
                                  >
                                    {ConversationLogic.formatDate(conv.updatedAt)}
                                  </Typography>
                                )}
                              />
                              {loadingConversationId === conv.id && (
                                <CircularProgress size={20} sx={{ml: 1}}/>
                              )}
                            </div>
                          )}
                          {editingConversationId === conv.id ? (
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
                              <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                setEditingConversationId(conv.id);
                                setEditingConversationName(conv.name);
                              }}>
                                <EditIcon fontSize="small"/>
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip size="small" title="More">
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
                          labels={labels}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>
      {/* Delete Label Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteLabelId}
        onClose={(confirmed) => {
          if (confirmed) {
            confirmDeleteLabel();
          } else {
            closeDeleteLabelConfirm();
          }
        }}
        title="Delete Label"
        content={`Are you sure you want to delete the label "${deleteLabelName}"? Conversations using this label will become unlabeled.`}
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