import {Alert, Box, Divider, Menu, MenuItem, Snackbar} from "@mui/material";
import {
  DeleteOutlined as DeleteOutlinedIcon,
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import React, {useState} from "react";
import ConversationLogic from "../../../lib/conversation/ConversationLogic";
import ChatLogic from "../../../lib/chat/ChatLogic";
import FileLogic from "../../../lib/common/file/FileLogic";
import {COLOR_LABELS} from "./constants/ColorLabels";
import ShareConversationDialog from "./ShareConversationDialog";
import SaveAsConversationDialog from "./SaveAsConversationDialog";

function ConversationMenu({
                            conversationIndex,
                            anchorEl,
                            setAnchorEl,
                            menuIndex,
                            setMenuIndex,
                            conversations,
                            setConversations,
                            selectedConversationId,
                            setSelectedConversationId,
                            setMessages,
                            setConversationLoadKey,
                            isGeneratingRef,
                            handleGenerateRef,
                            setLoadingConversationId,
                          }) {
  const conversationLogic = new ConversationLogic();

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Share dialog state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);

  // Save As dialog state
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [saveAsConversationIndex, setSaveAsConversationIndex] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const openShareDialog = (index) => {
    setSelectedConversationIndex(index);
    setShareDialogOpen(true);
  };

  const openSaveAsDialog = (index) => {
    setSaveAsConversationIndex(index);
    setSaveAsDialogOpen(true);
  };

  const deleteConversation = async (index) => {
    const conversationId = conversations[index].id;

    // If the conversation is currently selected, stop generating
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
          const fileNames = FileLogic.getFilenamesFromUrls(fileUrls);
          const fileLogic = new FileLogic();
          await fileLogic.deleteFiles(fileNames);
        } catch (err) {
          setAlertOpen(true);
          setAlertMessage(err.message);
          setAlertSeverity('error');
        }
      }

      // Remove the conversation in UI
      setConversations((prevConversations) => prevConversations.filter(c => c.id !== conversationId));

      setConversationLoadKey(prev => prev + 1);
      setAlertOpen(true);
      setAlertMessage('Conversation deleted');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
    }

    if (conversationId === selectedConversationId) {
      setSelectedConversationId(null);
      setMessages(null);
    }
    setLoadingConversationId(null);
  };

  const updateConversationColorLabel = async (index, colorLabel) => {
    const conversationId = conversations[index].id;
    setLoadingConversationId(conversationId);
    try {
      const updatedConversation = await conversationLogic.updateConversationColorLabel(
        conversationId, conversations[index].version, colorLabel
      );
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
    }
    setLoadingConversationId(null);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={menuIndex === conversationIndex}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          openSaveAsDialog(conversationIndex);
          handleMenuClose();
        }}>
          <SaveOutlinedIcon fontSize="small" className="mr-1"/>
          Save As
        </MenuItem>
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          openShareDialog(conversationIndex);
          handleMenuClose();
        }}>
          <ShareIcon fontSize="small" className="mr-1"/>
          Share
        </MenuItem>
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          deleteConversation(conversationIndex);
          handleMenuClose();
        }}>
          <DeleteOutlinedIcon fontSize="small" className="mr-1"/>
          Delete
        </MenuItem>
        <Divider/>
        <MenuItem disabled>Set label</MenuItem>
        {COLOR_LABELS.map((opt) => (
          <MenuItem dense key={`lbl-${String(opt.key)}`} onClick={(e) => {
            e.stopPropagation();
            updateConversationColorLabel(conversationIndex, opt.key);
            handleMenuClose();
          }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: opt.color, mr: 1 }} />
            {opt.name}
          </MenuItem>
        ))}
      </Menu>

      <ShareConversationDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        conversation={conversations[selectedConversationIndex]}
        setConversation={(updatedConversation) => {
          setConversations((prevConversations) => {
            const newConversations = [...prevConversations];
            newConversations[selectedConversationIndex] = updatedConversation;
            return newConversations;
          });
        }}
      />

      <SaveAsConversationDialog
        open={saveAsDialogOpen}
        onClose={() => setSaveAsDialogOpen(false)}
        conversationId={conversations[saveAsConversationIndex]?.id}
        defaultName={(conversations[saveAsConversationIndex]?.name) + ' Copy'}
        onSaved={(newConversation) => {
          if (isGeneratingRef && isGeneratingRef.current && handleGenerateRef.current) {
            handleGenerateRef.current();
          }

          setConversations(prev => [newConversation, ...prev]);
          setSelectedConversationId(newConversation.id);
          setMessages(newConversation.messages);
          setConversationLoadKey(prev => prev + 1);
        }}
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

export default ConversationMenu;