import React from 'react';
import {Button} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import {ChatLogic} from "../../../src/logic/ChatLogic";

function ClearConversationButton({setMessages}) {
  const chatLogic = new ChatLogic();

  const handleClear = () => {
    setMessages(chatLogic.initMessages);
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

export default ClearConversationButton;