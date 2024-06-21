import React, {useEffect, useRef, useState} from 'react';
import {Button} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {ChatLogic} from "../../../src/logic/ChatLogic";

function ChatSend({
                    messages,
                    setMessages,
                    apiType,
                    model,
                    temperature,
                    stream,
                    setAlertMessage,
                    setAlertOpen
}) {
  const chatLogic = new ChatLogic();

  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  const currentRequestIndex = useRef(0);

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
      setAlertOpen(true);
      return;
    }

    switchStatus(true);

    currentRequestIndex.current += 1;
    const thisRequestIndex = currentRequestIndex.current;

    const scrollableContainer = document.querySelector('.local-scroll-scrollable');

    if (!stream) {

      const content = await chatLogic.nonStreamGenerate(messages, apiType, model, temperature, stream);

      if (!(thisRequestIndex === currentRequestIndex.current && isGeneratingRef.current)) {
        // console.log(`previous index ${thisRequestIndex}, current index ${currentRequestIndex.current}, is generating ${isGeneratingRef.current}`);
        return;
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.createAssistantMessage(content), chatLogic.emptyUserMessage]);

    } else {

      let isFirstChunk = true;

      for await (const chunk of chatLogic.streamGenerate(messages, apiType, model, temperature, stream)) {

        if (!(thisRequestIndex === currentRequestIndex.current && isGeneratingRef.current)) {
          return;
        }

        const isAtBottom = (scrollableContainer.scrollHeight - scrollableContainer.scrollTop) <= (scrollableContainer.clientHeight + 50);

        if (isFirstChunk) {
          setMessages(prevMessages => [...prevMessages, chatLogic.emptyAssistantMessage]);
          isFirstChunk = false;
        }

        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });

        if (isAtBottom) scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.emptyUserMessage]);

    }

    scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    switchStatus(false);
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
        setAlertOpen(true);
        switchStatus(false);
      }
    } else {
      switchStatus(false);
    }
  };

  return (
    <div className="m-2">
      <Button
        id="send"
        variant="contained"
        color="primary"
        onClick={handleGenerate}
        startIcon={isGenerating ? <StopIcon/> : <PlayArrowIcon/>}
      >
        {isGenerating ? "Stop" : "Send"}
      </Button>
    </div>
  );
}

export default ChatSend;