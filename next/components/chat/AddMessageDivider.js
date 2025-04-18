import {Divider, IconButton, Tooltip} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, {useState} from "react";
import ChatLogic from "../../lib/chat/ChatLogic";

function AddMessageDivider({
                             messages,
                             setMessages,
                             index,
                             setIsGenerating,
                             isGeneratingRef,
                             setConversationUpdateTrigger
                           }) {
  const chatLogic = new ChatLogic();
  const [isHovered, setIsHovered] = useState(false);

  const handleMessageAdd = (index) => {
    if (index === messages.length - 1) {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }

    const newMessages = [...messages];
    newMessages.splice(index + 1, 0, chatLogic.emptyUserMessage);
    setMessages(newMessages);

    setConversationUpdateTrigger(true);
  };

  return (
    <div
      className="flex items-center my-1 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Divider
        sx={{
          flexGrow: 1,
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />
      <div
        className={`absolute left-1/2 transform -translate-x-1/2`}>
        <Tooltip title="Add Message" placement="top">
          <IconButton
            size="small"
            onClick={() => handleMessageAdd(index)}
            sx={{
              opacity: isHovered ? 1 : 0.2,
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            <AddCircleIcon
              fontSize="small"
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export default AddMessageDivider;