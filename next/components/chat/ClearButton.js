import React from 'react';
import {Button} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import ChatLogic from "../../lib/chat/ChatLogic";

function ClearButton({
                       setMessages,
                       setIsGenerating,
                       isGeneratingRef,
                       setSelectedConversationId
                     }) {
  const chatLogic = new ChatLogic();

  const handleClear = () => {
    setIsGenerating(false);
    isGeneratingRef.current = false;
    setMessages(chatLogic.initMessages);
    setSelectedConversationId(null);
  };

  return (
    <div className="m-2">
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClear}
        startIcon={<RefreshIcon/>}
      >
        Clear
      </Button>
    </div>
  );
}

export default ClearButton;