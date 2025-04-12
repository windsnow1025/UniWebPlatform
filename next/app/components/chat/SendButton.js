import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Snackbar, Tooltip} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ChatLogic from "../../../src/chat/ChatLogic";

function SendButton({
                      isGenerating,
                      setIsGenerating,
                      isGeneratingRef,
                      setConversationUpdateTrigger,
                      messages,
                      setMessages,
                      apiType,
                      model,
                      temperature,
                      stream,
                    }) {
  const chatLogic = new ChatLogic();

  const currentRequestIndex = useRef(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        document.activeElement.blur();
        const sendButton = document.getElementById('send');
        setTimeout(() => sendButton.click(), 0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [messages]);

  const handleNonStreamGenerate = async (currentReqIndex) => {
    const content = await chatLogic.nonStreamGenerate(messages, apiType, model, temperature);

    if (currentRequestIndex.current !== currentReqIndex || !isGeneratingRef.current) {
      return;
    }

    const imageUrl = await chatLogic.getImageUrl(content.image);

    setMessages(prevMessages => [
      ...prevMessages,
      chatLogic.createAssistantMessage(content.text, content.display, imageUrl),
      chatLogic.emptyUserMessage,
    ]);
  };

  const handleStreamGenerate = async (currentReqIndex) => {
    let isFirstChunk = true;
    const generator = chatLogic.streamGenerate(messages, apiType, model, temperature);

    for await (const chunk of generator) {
      if (!(currentReqIndex === currentRequestIndex.current && isGeneratingRef.current)) {
        return;
      }

      const scrollableContainer = document.querySelector('#chat-messages');
      const isAtBottom = (scrollableContainer.scrollHeight - scrollableContainer.scrollTop) <= (scrollableContainer.clientHeight + 50);

      // Create Empty Assistant Message on First Chunk
      if (isFirstChunk) {
        setMessages(prevMessages => [...prevMessages, chatLogic.emptyAssistantMessage]);
        isFirstChunk = false;
      }

      // Final citation text
      if (typeof chunk === "string") {
        setMessages(prevMessages =>
          chatLogic.replaceMessageText(prevMessages, prevMessages.length - 1, 0, chunk)
        );
        break;
      }

      const imageUrl = await chatLogic.getImageUrl(chunk.image);

      setMessages(prevMessages => chatLogic.updateMessage(
        prevMessages, prevMessages.length - 1, chunk, imageUrl
      ));

      if (isAtBottom) scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }

    setMessages(prevMessages => [...prevMessages, chatLogic.emptyUserMessage]);
  };

  const switchStatus = (status) => {
    isGeneratingRef.current = status;
    setIsGenerating(status);
  };

  const handleGenerate = async () => {
    if (!localStorage.getItem('token')) {
      setAlertMessage('Please sign in first.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (!isGenerating) {
      switchStatus(true);
      currentRequestIndex.current += 1;
      const currentReqIndex = currentRequestIndex.current;

      try {
        if (stream) {
          await handleStreamGenerate(currentReqIndex);
        } else {
          await handleNonStreamGenerate();
        }
      } catch (error) {
        setAlertMessage(error.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        switchStatus(false);
        setConversationUpdateTrigger(true);
      }
    } else {
      switchStatus(false);
    }
  };

  return (
    <div className="m-2">
      <Tooltip title="Ctrl + Enter">
        <Button
          id="send"
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          startIcon={isGenerating ? <StopIcon/> : <PlayArrowIcon/>}
        >
          {isGenerating ? "Stop" : "Send"}
        </Button>
      </Tooltip>
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
  );
}

export default SendButton;