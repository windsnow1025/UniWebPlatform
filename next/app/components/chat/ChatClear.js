import React from 'react';
import {Button} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { ChatLogic } from "../../../src/logic/ChatLogic";

function ChatClear({ setMessages }) {
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
        startIcon={<ClearIcon/>}
      >
        Clear
      </Button>
    </div>
  );
}

export default ChatClear;