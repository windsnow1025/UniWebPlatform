import React, { useEffect, useState } from 'react';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Paper, Box, InputBase } from "@mui/material";

import ChatLogic from "../../../src/conversation/chat/ChatLogic";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import SimpleChatMessagesDiv from "../../../app/components/chat/simple/SimpleChatMessagesDiv";
import SimpleSendButton from "../../../app/components/chat/simple/SimpleSendButton";
import SimpleClearButton from "../../../app/components/chat/simple/SimpleClearButton";

function EasyChat() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const title = "Simple AI Chat";
  useEffect(() => {
    document.title = title;
  }, []);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState([chatLogic.initMessages[0]]);
  const [newContent, setNewContent] = useState('');
  const apiType = chatLogic.defaultApiType;
  const model = chatLogic.defaultModel;
  const temperature = 0;
  const stream = true;

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
            <Box display="flex" alignItems="center" p={1} m={1} component={Paper} elevation={2}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type a message"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </Box>
            <div className="flex-around m-1">
              <div className="flex-center">
                <SimpleSendButton
                  messages={messages}
                  setMessages={setMessages}
                  apiType={apiType}
                  model={model}
                  temperature={temperature}
                  stream={stream}
                  newContent={newContent}
                />
                <SimpleClearButton setMessages={setMessages}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default EasyChat;