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
    }
  }, [messages]);

  const startGenerate = async () => {
    if (!localStorage.getItem('token')) {
      setAlertMessage('Please sign in first.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    switchStatus(true);

    currentRequestIndex.current += 1;
    const thisRequestIndex = currentRequestIndex.current;

    const scrollableContainer = document.querySelector('.local-scroll-scrollable');

    if (!stream) {

      const content = await chatLogic.nonStreamGenerate(messages, apiType, model, temperature);

      if (!(thisRequestIndex === currentRequestIndex.current && isGeneratingRef.current)) {
        // console.log(`previous index ${thisRequestIndex}, current index ${currentRequestIndex.current}, is generating ${isGeneratingRef.current}`);
        return;
      }

      const text = content.text ? content.text : '';

      setMessages(prevMessages => [
        ...prevMessages,
        chatLogic.createAssistantMessage(text, content.display),
        chatLogic.emptyUserMessage,
      ]);

    } else {

      let isFirstChunk = true;
      const generator = chatLogic.streamGenerate(messages, apiType, model, temperature);

      for await (const chunk of generator) {
        // Final text for citations
        if (typeof chunk === "string") {
          setMessages(prevMessages =>
            chatLogic.replaceMessageText(prevMessages, prevMessages.length - 1, chunk)
          );
          break;
        }
        
        if (!(thisRequestIndex === currentRequestIndex.current && isGeneratingRef.current)) {
          return;
        }

        const isAtBottom = (scrollableContainer.scrollHeight - scrollableContainer.scrollTop) <= (scrollableContainer.clientHeight + 50);

        if (isFirstChunk) {
          setMessages(prevMessages => [...prevMessages, chatLogic.emptyAssistantMessage]);
          isFirstChunk = false;
        }

        setMessages(prevMessages => chatLogic.appendToMessage(
          prevMessages, prevMessages.length - 1, chunk
        ));

        if (isAtBottom) scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.emptyUserMessage]);

    }

    switchStatus(false);

    setConversationUpdateTrigger(true);
  }

  const switchStatus = (status) => {
    isGeneratingRef.current = status;
    setIsGenerating(status);
  }

  const handleGenerate = async () => {
    if (isGenerating === false) {
      try {
        await startGenerate();
      } catch (error) {
        setAlertMessage(error.message);
        setAlertSeverity('error');
        setAlertOpen(true);
        switchStatus(false);
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