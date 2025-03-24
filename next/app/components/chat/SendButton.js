import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Snackbar, Tooltip} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ChatLogic from "../../../src/chat/ChatLogic";
import FileLogic from "../../../src/common/file/FileLogic";

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
  const fileLogic = new FileLogic();

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

  const base64ToFile = (base64String, filename) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, {type: "image/png"});
  };

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
        return;
      }

      let text = content.text ? content.text : '';

      let imageUrl = null;
      if (content.image) {
        const file = base64ToFile(content.image, "generated_image.png");
        const uploadedFiles = await fileLogic.uploadFiles([file]);
        imageUrl = uploadedFiles[0];
      }

      setMessages(prevMessages => [
        ...prevMessages,
        chatLogic.createAssistantMessage(text, content.display, imageUrl),
        chatLogic.emptyUserMessage,
      ]);

    } else {
      let isFirstChunk = true;
      const generator = chatLogic.streamGenerate(messages, apiType, model, temperature);

      for await (const chunk of generator) {
        // Final citation text
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

        let imageUrl = null;
        if (chunk.image) {
          const file = base64ToFile(chunk.image, "generated_image.png");
          const uploadedFiles = await fileLogic.uploadFiles([file]);
          imageUrl = uploadedFiles[0];
        }

        setMessages(prevMessages => chatLogic.updateMessage(
          prevMessages, prevMessages.length - 1, chunk, imageUrl
        ));

        if (isAtBottom) scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.emptyUserMessage]);
    }

    switchStatus(false);
    setConversationUpdateTrigger(true);
  };

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