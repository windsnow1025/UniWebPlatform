import React, {useEffect, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  List,
  Snackbar,
  Typography,
} from '@mui/material';
import {ExpandMore as ExpandMoreIcon} from '@mui/icons-material';
import ConversationLogic from "../../../../lib/conversation/ConversationLogic";
import PromptLogic from "../../../../lib/prompt/PromptLogic";
import LabelLogic from "../../../../lib/label/LabelLogic";
import {isEqual} from 'lodash';
import {NO_LABEL_COLOR} from "./label/PresetColors";
import ConversationMenu from "./menu/ConversationMenu";
import {StorageKeys} from "../../../../lib/common/Constants";
import NewLabelAccordion from "./NewLabelAccordion";
import LabelGroupHeader from "./LabelGroupHeader";
import ConversationItem from "./ConversationItem";

function ConversationList({
                            conversations,
                            setConversations,
                            selectedConversationId,
                            setSelectedConversationId,
                            setMessages,
                            conversationsReloadKey,
                            setConversationsReloadKey,
                            setIsTemporaryChat,
                            abortGenerateRef,
                            clearUIStateRef,
                            conversationUpdatePromiseRef,
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

  // Labels state
  const [labels, setLabels] = useState([]);

  // Loading state
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [loadingConversationId, setLoadingConversationId] = useState(null);
  const [isLoadingLabels, setIsLoadingLabels] = useState(false);

  const conversationLogic = new ConversationLogic();
  const labelLogic = new LabelLogic();

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

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
  }, [conversationsReloadKey, signedIn]);

  const loadLabels = async () => {
    setIsLoadingLabels(true);
    try {
      const fetchedLabels = await labelLogic.fetchLabels();
      setLabels(fetchedLabels || []);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setIsLoadingLabels(false);
    }
  };

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const versions = await conversationLogic.fetchConversationVersions();

      const currentMetadata = conversations.map(conv => ({id: conv.id, version: conv.version}));
      const sortById = (a, b) => a.id - b.id;
      if (isEqual([...versions].sort(sortById), [...currentMetadata].sort(sortById))) {
        return JSON.parse(JSON.stringify(conversations));
      }

      if (conversationUpdatePromiseRef?.current) {
        await conversationUpdatePromiseRef.current.catch(() => {});
      }

      const newConversations = await conversationLogic.fetchConversations();
      setConversations(newConversations);

      if (selectedConversationId) {
        const currentConversation = newConversations.find(c => c.id === selectedConversationId);
        if (currentConversation) {
          await ConversationLogic.populatePromptContents(currentConversation.messages);
          setMessages(currentConversation.messages);
        } else {
          showAlert('Selected conversation not found', 'warning');
        }
      }

      return JSON.parse(JSON.stringify(newConversations));
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const activateConversation = async (conversation) => {
    await ConversationLogic.populatePromptContents(conversation.messages);
    setIsTemporaryChat(false);
    setMessages(conversation.messages);
    setSelectedConversationId(conversation.id);
  };

  const selectConversation = async (conversationId) => {
    clearUIStateRef.current?.();

    setLoadingConversationId(conversationId);

    const conversations = await loadConversations();
    const conversation = conversations.find(conversation => conversation.id === conversationId);

    await activateConversation(conversation);
    setLoadingConversationId(null);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
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

  // Build ordered group keys: 'no-label' first, then all labels
  const labelIds = labels.map(label => label.id);
  const groupKeys = ['no-label', ...labelIds];

  const getLabelInfo = (key) => {
    if (key === 'no-label') {
      return {id: 'no-label', name: 'No label', color: NO_LABEL_COLOR};
    }
    return labels.find(label => label.id === key);
  };

  return (
    <>
      <div className="local-scroll-scrollable">
        <div className="local-scroll-unscrollable-y">
          <NewLabelAccordion setLabels={setLabels}/>

          <Box sx={{mb: 1}}/>

          {/* Label Groups */}
          {groupKeys.map((key) => {
            const labelInfo = getLabelInfo(key);
            const isNoLabel = key === 'no-label';

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
                    <LabelGroupHeader
                      label={labelInfo}
                      count={groups[key]?.length || 0}
                      isNoLabel={isNoLabel}
                      setLabels={setLabels}
                      setConversations={setConversations}
                    />
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{padding: 0}}>
                  <List disablePadding>
                    {groups[key]?.map(({conv, idx}) => (
                      <div key={conv.id}>
                        <ConversationItem
                          conversation={conv}
                          isSelected={conv.id === selectedConversationId}
                          isLoading={loadingConversationId === conv.id}
                          onSelect={selectConversation}
                          setConversations={setConversations}
                          onMenuOpen={(e) => {
                            setAnchorEl(e.currentTarget);
                            setMenuIndex(idx);
                          }}
                        />
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
                          setConversationsReloadKey={setConversationsReloadKey}
                          abortGenerateRef={abortGenerateRef}
                          clearUIStateRef={clearUIStateRef}
                          activateConversation={activateConversation}
                          setLoadingConversationId={setLoadingConversationId}
                          labels={labels}
                        />
                      </div>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
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