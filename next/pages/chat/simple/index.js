import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline, Paper} from "@mui/material";

import ChatLogic from "../../../src/conversation/chat/ChatLogic";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import SendButton from "../../../app/components/chat/SendButton";
import ClearConversationButton from "../../../app/components/chat/ClearConversationButton";
import SimpleChatMessagesDiv from "../../../app/components/chat/simple/SimpleChatMessagesDiv";

function EasyChat() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Simple AI Chat";
  useEffect(() => {
    document.title = title;
  }, []);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState(chatLogic.initMessages);
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
            <div className="flex-around m-1">
              <div className="flex-center">
                <SendButton
                  messages={messages}
                  setMessages={setMessages}
                  apiType={apiType}
                  model={model}
                  temperature={temperature}
                  stream={stream}
                />
                <ClearConversationButton setMessages={setMessages}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default EasyChat;