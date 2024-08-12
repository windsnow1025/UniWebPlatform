import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {Box, CssBaseline, IconButton, InputAdornment, Paper, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

import ChatLogic from "../../../src/conversation/chat/ChatLogic";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import SimpleChatMessagesDiv from "../../../app/components/chat/simple/SimpleChatMessagesDiv";

function SimpleChat() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const title = "Simple AI Chat";
  useEffect(() => {
    document.title = title;
  }, []);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState([]);
  const [newContent, setNewContent] = useState('');
  const apiType = chatLogic.defaultApiType;
  const model = chatLogic.defaultModel;
  const temperature = 0;
  const stream = true;

  const handleSend = async () => {
    if (!localStorage.getItem('token')) {
      alert('Please sign in first.');
      return;
    }

    const newMessage = chatLogic.createUserMessage(newContent);
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setNewContent('');

    const scrollableContainer = document.querySelector('.local-scroll-scrollable');

    if (!stream) {
      const content = await chatLogic.nonStreamGenerate(newMessages, apiType, model, temperature, stream);
      setMessages(prevMessages => [...prevMessages, chatLogic.createAssistantMessage(content), chatLogic.emptyUserMessage]);
    } else {
      let isFirstChunk = true;
      for await (const chunk of chatLogic.streamGenerate(newMessages, apiType, model, temperature, stream)) {
        if (isFirstChunk) {
          setMessages(prevMessages => [...prevMessages, chatLogic.emptyAssistantMessage]);
          isFirstChunk = false;
        }
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }
    }
    scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar
          title={title}
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
          infoUrl={"/markdown/view/chat-doc.md"}
        />
        <div className="local-scroll-unscrollable-x">
          <div className="local-scroll-unscrollable-y">
            <Paper elevation={0} variant='outlined' className="m-1 rounded-lg local-scroll-unscrollable-y">
              <div className="local-scroll-scrollable p-2">
                <SimpleChatMessagesDiv
                  messages={messages}
                  setMessages={setMessages}
                />
              </div>
            </Paper>
            <Box component={Paper} elevation={2} className="flex items-center p-2 m-2">
              <TextField
                placeholder="Type a message"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 m-1"
                multiline
                minRows={1}
                maxRows={10}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSend} color="primary">
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SimpleChat;