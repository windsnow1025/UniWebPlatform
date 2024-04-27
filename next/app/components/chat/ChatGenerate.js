import React, {useEffect, useRef, useState} from 'react';
import {Button} from "@mui/material";
import {ChatLogic} from "../../../src/logic/ChatLogic";

function ChatGenerate({ messages, setMessages, apiType, model, temperature, stream, setAlertMessage, setAlertOpen }) {
  const chatLogic = new ChatLogic();

  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  const currentRequestIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        document.activeElement.blur();
        const generateButton = document.getElementById('generate');
        setTimeout(() => generateButton.click(), 0);
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

    setIsGenerating(true);

    isGeneratingRef.current = true;
    currentRequestIndex.current += 1;
    const thisRequestIndex = currentRequestIndex.current;

    if (!stream) {

      const content = await chatLogic.nonStreamGenerate(messages, apiType, model, temperature, stream);

      if (!(thisRequestIndex === currentRequestIndex.current && isGeneratingRef.current)) {
        console.log(`previous index ${thisRequestIndex}, current index ${currentRequestIndex.current}, is generating ${isGeneratingRef.current}`);
        return;
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.createAssistantMessage(content), chatLogic.emptyUserMessage]);

    } else {

      let isFirstChunk = true;

      for await (const chunk of chatLogic.streamGenerate(messages, apiType, model, temperature, stream)) {

        if (!(thisRequestIndex === currentRequestIndex.current && isGeneratingRef.current)) {
          return;
        }

        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

        if (isFirstChunk) {
          setMessages(prevMessages => [...prevMessages, chatLogic.emptyAssistantMessage]);
          isFirstChunk = false;
        }

        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });

        if (isAtBottom) window.scrollTo(0, document.body.scrollHeight);
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.emptyUserMessage]);

    }

    window.scrollTo(0, document.body.scrollHeight);
    setIsGenerating(false);
  }

  const stopGenerate = () => {
    isGeneratingRef.current = false;
    setIsGenerating(false);
  }

  const handleGenerate = async () => {
    if (isGenerating === false) {
      try {
        await startGenerate();
      } catch (error) {
        setAlertMessage(error.message);
        setAlertOpen(true);
        setIsGenerating(false);
      }
    } else {
      stopGenerate();
    }
  };

  /**
   * Button clicked -> Set button status && Set Ref status
   *
   * Finish reasons:
   * - Normally finished -> Set button status to false
   * - Terminated dut to unexpected API Error -> Set button status to false
   * - Aborted by user -> No actions
   *   - Ref status is true: Previous Index does not match with Current Index
   *   - Ref status is false
   * **/

  return (
    <div className="m-2">
      <Button id="generate" variant="contained" color="primary" onClick={handleGenerate}>
        {isGenerating ? "Stop" : "Generate"}
      </Button>
    </div>
  );
}

export default ChatGenerate;