import React from 'react';
import IconButton from '@mui/material/IconButton';
import {useTheme} from '@mui/material/styles';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import {Tooltip} from "@mui/material";

const ScrollToBottomButton = () => {
  const theme = useTheme();

  const handleScrollToBottom = () => {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Tooltip title="Scroll to Bottom">
      <IconButton
        size="large"
        onClick={handleScrollToBottom}
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2.5),
          left: theme.spacing(2.5),
          boxShadow: 10,
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.default}, white 10%)`,
          zIndex: 1200,
        }}
      >
        <KeyboardDoubleArrowDownIcon/>
      </IconButton>
    </Tooltip>
  );
};

export default ScrollToBottomButton;
