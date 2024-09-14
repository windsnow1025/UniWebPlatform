import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {Box, Collapse, CssBaseline, IconButton, InputAdornment, Paper, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

import ChatLogic from "../../../src/conversation/chat/ChatLogic";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import SimpleChatMessagesDiv from "../../../app/components/chat/simple/SimpleChatMessagesDiv";
import ConversationSidebar from "../../../app/components/chat/conversation/ConversationSidebar";
import useScreenSize from "../../../app/hooks/useScreenSize";
import SimpleMessageInputBox from "../../../app/components/chat/simple/SimpleMessageInputBox";

function SimpleChat() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const screenSize = useScreenSize();
  const [drawerOpen, setDrawerOpen] = useState();
  const title = "Simple AI Chat";
  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    setDrawerOpen(screenSize !== 'xs' && screenSize !== 'sm');
  }, [screenSize]);

  const [messages, setMessages] = useState([]);

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
          <Paper elevation={2} sx={{borderRadius: 0}} className="flex">
            <Collapse in={drawerOpen} orientation="horizontal" className="overflow-auto">
              <ConversationSidebar
                drawerOpen={drawerOpen}
                messages={messages}
                setMessages={setMessages}
              />
            </Collapse>
          </Paper>
          <div className="local-scroll-unscrollable-y">
            <Paper elevation={0} variant='outlined' className="m-1 rounded-lg local-scroll-unscrollable-y">
              <div className="local-scroll-scrollable p-2">
                <SimpleChatMessagesDiv
                  messages={messages}
                />
              </div>
            </Paper>
            <SimpleMessageInputBox
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SimpleChat;