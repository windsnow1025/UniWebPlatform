import {Alert, Button, Snackbar, CircularProgress} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import React, {useState} from "react";
import ChatLogic from "../../../lib/chat/ChatLogic";
import ConversationLogic from "../../../lib/conversation/ConversationLogic";

function NewConversationButton({
                                 setMessages,
                                 setConversations,
                                 setSelectedConversationId,
                                 setConversationLoadKey,
                                 setIsTemporaryChat,
                                 size,
                                 isGeneratingRef,
                                 handleGenerateRef,
                               }) {
  const conversationLogic = new ConversationLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [loading, setLoading] = useState(false);

  const handleNewConversation = async () => {
    if (isGeneratingRef && isGeneratingRef.current && handleGenerateRef.current) {
      handleGenerateRef.current();
    }
    setLoading(true);
    try {
      // YYYY-MM-DD HH:MM:SS
      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

      const defaultMessages = ChatLogic.getInitMessages();

      const newConversation = await conversationLogic.addConversation({
        name: dateStr,
        messages: defaultMessages
      });

      setIsTemporaryChat(false);
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversationId(newConversation.id);
      setMessages(newConversation.messages);
      setConversationLoadKey(prev => prev + 1);
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-nowrap">
      <Button
        size={size}
        variant="text"
        startIcon={loading ? <CircularProgress size={16}/> : <ChatIcon/>}
        onClick={handleNewConversation}
        disabled={loading}
        id={`new-conversation-button-${size}`}
        fullWidth
      >
        {loading ? "Creating..." : "New Conversation"}
      </Button>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default NewConversationButton;
