import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Snackbar, Tooltip} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ChatLogic from "../../lib/chat/ChatLogic";
import {StorageKeys} from "../../lib/common/Constants";

function SendButton({
                      isGenerating,
                      setIsGenerating,
                      isGeneratingRef,
                      setIsLastChunkThought,
                      setConversationUpdateKey,
                      setCreditRefreshKey,
                      handleGenerateRef,
                      messages,
                      setMessages,
                      apiType,
                      model,
                      temperature,
                      stream,
                      thought,
                      codeExecution,
                    }) {
  const chatLogic = new ChatLogic();

  const sendButtonRef = useRef(null);

  const latestRequestIndex = useRef(0);
  const isFirstStreamOpen = useRef(true);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.activeElement.blur();
        setTimeout(() => sendButtonRef.current.click(), 0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [messages]);

  const handleNonStreamGenerate = async (currentReqIndex) => {
    const content = await chatLogic.nonStreamGenerate(
      messages, apiType, model, temperature, thought, codeExecution
    );

    if (latestRequestIndex.current !== currentReqIndex || !isGeneratingRef.current) {
      return false;
    }

    const fileUrls = await ChatLogic.getFileUrls(content.files || []);

    setMessages(prevMessages => [
      ...prevMessages,
      ChatLogic.createAssistantMessage(content.text, content.thought, content.display, fileUrls),
      ChatLogic.getEmptyUserMessage(),
    ]);

    return true;
  };

  const handleStreamGenerate = async (currentReqIndex, onOpenCallback) => {
    let isFirstChunk = true;
    const generator = chatLogic.streamGenerate(
      messages, apiType, model, temperature, thought, codeExecution, onOpenCallback
    );

    for await (const chunk of generator) {
      if (!(currentReqIndex === latestRequestIndex.current && isGeneratingRef.current)) {
        return false;
      }

      const scrollableContainer = document.querySelector('#chat-messages');
      const isAtBottom = (scrollableContainer.scrollHeight - scrollableContainer.scrollTop) <= (scrollableContainer.clientHeight + 50);

      // Create Empty Assistant Message on First Chunk
      if (isFirstChunk) {
        setMessages(prevMessages => [...prevMessages, ChatLogic.getEmptyAssistantMessage()]);
        isFirstChunk = false;
      }

      // Final text
      if (typeof chunk === "string") {
        setMessages(prevMessages =>
          ChatLogic.replaceMessageText(prevMessages, prevMessages.length - 1, 0, chunk)
        );
        break;
      }

      // For thought loading status
      if (chunk.thought) {
        setIsLastChunkThought(true);
      } else if (chunk.text || (chunk.files && chunk.files.length !== 0) || chunk.display) {
        setIsLastChunkThought(false);
      }

      const fileUrls = await ChatLogic.getFileUrls(chunk.files || []);

      setMessages(prevMessages => ChatLogic.updateMessage(
        prevMessages, prevMessages.length - 1, chunk, fileUrls
      ));

      if (isAtBottom) {
        setTimeout(() => {
          scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
        }, 0);
      }
    }

    setMessages(prevMessages => [...prevMessages, ChatLogic.getEmptyUserMessage()]);

    return true;
  };

  const switchStatus = (status) => {
    isGeneratingRef.current = status;
    setIsGenerating(status);
  };

  const handleGenerate = async () => {
    if (!localStorage.getItem(StorageKeys.Token)) {
      setAlertMessage('Please sign in first.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (!isGenerating) {
      switchStatus(true);
      latestRequestIndex.current += 1;
      const currentReqIndex = latestRequestIndex.current;

      isFirstStreamOpen.current = true;
      const handleStreamOpen = () => {
        if (isFirstStreamOpen.current) {
          isFirstStreamOpen.current = false;
          return;
        }

        // This is a reconnection. Clear the last assistant message.
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            const newMessages = [...prevMessages];
            // Replace the partially filled message with a new empty one
            newMessages[newMessages.length - 1] = ChatLogic.getEmptyAssistantMessage();
            return newMessages;
          }
          return prevMessages;
        });
      };

      try {
        let success;
        if (stream) {
          success = await handleStreamGenerate(currentReqIndex, handleStreamOpen);
        } else {
          success = await handleNonStreamGenerate(currentReqIndex);
        }
        if (success) {
          switchStatus(false);
        }
      } catch (error) {
        switchStatus(false);
        setAlertMessage(error.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setConversationUpdateKey(prev => prev + 1);
        setCreditRefreshKey(prev => prev + 1);
      }
    } else {
      switchStatus(false);
    }
  };

  useEffect(() => {
    handleGenerateRef.current = handleGenerate;
  })

  return (
    <div className="m-2">
      <Tooltip title="Ctrl/Cmd + Enter">
        <Button
          id="send"
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          startIcon={isGenerating ? <StopIcon/> : <PlayArrowIcon/>}
          disabled={messages === null}
          ref={sendButtonRef}
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
