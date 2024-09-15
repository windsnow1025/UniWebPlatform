import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {Collapse, CssBaseline, Paper} from "@mui/material";

import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import SimpleChatMessagesDiv from "../../../app/components/chat/simple/SimpleChatMessagesDiv";
import useScreenSize from "../../../app/hooks/useScreenSize";
import SimpleMessageInputBox from "../../../app/components/chat/simple/SimpleMessageInputBox";
import SimpleConversationSidebar from "../../../app/components/chat/simple/SimpleConversationSidebar";
import ToggleConversationButton from "../../../app/components/chat/conversation/ToggleConversationButton";

function SimpleAIChat() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
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
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

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
              <SimpleConversationSidebar
                drawerOpen={drawerOpen}
                setMessages={setMessages}
                conversations={conversations}
                setConversations={setConversations}
                setCurrentConversationId={setCurrentConversationId}
              />
            </Collapse>
          </Paper>
          <div className="local-scroll-unscrollable-y">
            <Paper elevation={0} variant='outlined' className="m-1 rounded-lg local-scroll-unscrollable-y">
              <ToggleConversationButton
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />
              <div className="local-scroll-scrollable p-2">
                <SimpleChatMessagesDiv
                  messages={messages}
                />
              </div>
            </Paper>
            <SimpleMessageInputBox
              messages={messages}
              setMessages={setMessages}
              setConversations={setConversations}
              currentConversationId={currentConversationId}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SimpleAIChat;