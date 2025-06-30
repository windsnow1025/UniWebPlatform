import React from 'react';
import {Button, IconButton, Tooltip} from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

function RetryButton({
                       messages,
                       setMessages,
                       isGenerating,
                       setIsGenerating,
                       isGeneratingRef,
                       handleGenerate
                     }) {
  const isRetryEnabled = () => {
    if (messages.length === 0) return false;

    // Find the last assistant message
    let lastAssistantIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        lastAssistantIndex = i;
        break;
      }
    }

    if (lastAssistantIndex === -1) return false;

    // Check if all messages after the last assistant message are empty
    for (let i = lastAssistantIndex + 1; i < messages.length; i++) {
      const message = messages[i];
      const hasNonEmptyContent = message.contents.some(content =>
        content.type === 'Text' && content.data.trim() !== ''
      );

      if (hasNonEmptyContent) return false;
    }

    return true;
  };

  const handleRetry = async () => {
    if (!isRetryEnabled()) return;

    // 1. Stop sending if it is sending
    if (isGenerating) {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }

    // 2. Remove empty messages after the last assistant message and remove the last assistant message
    setMessages(prevMessages => {
      let lastAssistantIndex = -1;
      for (let i = prevMessages.length - 1; i >= 0; i--) {
        if (prevMessages[i].role === 'assistant') {
          lastAssistantIndex = i;
          break;
        }
      }

      if (lastAssistantIndex === -1) return prevMessages;

      return prevMessages.slice(0, lastAssistantIndex);
    });

    // 3. Trigger sending
    setTimeout(() => {
      handleGenerate();
    }, 0);
  };

  return (
    <div>
      <Tooltip title="Retry last response">
        <IconButton
          id="retry"
          color="secondary"
          onClick={handleRetry}
          disabled={!isRetryEnabled()}
        >
          <ReplayIcon/>
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default RetryButton;
