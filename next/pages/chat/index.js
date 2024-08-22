import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {Collapse, CssBaseline, Paper} from "@mui/material";

import ChatLogic from "../../src/conversation/chat/ChatLogic";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import SettingsDiv from "../../app/components/chat/SettingsDiv";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import SendButton from "../../app/components/chat/SendButton";
import ChatMessagesDiv from "../../app/components/chat/ChatMessagesDiv";
import StatesDiv from "../../app/components/chat/StatesDiv";
import ClearButton from "../../app/components/chat/ClearButton";
import ConversationSidebar from "../../app/components/chat/ConversationSidebar";
import ToggleConversationButton from "../../app/components/chat/ToggleConversationButton";
import {EditableState} from "../../src/conversation/chat/Message";
import useScreenSize from '../../app/hooks/useScreenSize';

function Chat() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const screenSize = useScreenSize();
  const [drawerOpen, setDrawerOpen] = useState();
  const title = "AI Chat";

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    setDrawerOpen(screenSize !== 'xs' && screenSize !== 'sm');
  }, [screenSize]);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState(chatLogic.initMessages);
  const [apiType, setApiType] = useState(chatLogic.defaultApiType);
  const [model, setModel] = useState(chatLogic.defaultModel);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // States
  const [editableState, setEditableState] = useState(EditableState.RoleBased);
  const [shouldSanitize, setShouldSanitize] = useState(true);

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
            <div className="flex">
              <ToggleConversationButton
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />
              <div className="grow">
                <SettingsDiv
                  apiType={apiType}
                  setApiType={setApiType}
                  model={model}
                  setModel={setModel}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  stream={stream}
                  setStream={setStream}
                />
              </div>
            </div>
            <Paper elevation={0} variant='outlined' className="m-1 rounded-lg local-scroll-unscrollable-y">
              <div className="local-scroll-scrollable p-2">
                <ChatMessagesDiv
                  messages={messages}
                  setMessages={setMessages}
                  shouldSanitize={shouldSanitize}
                  editableState={editableState}
                />
              </div>
            </Paper>
            <div className="flex-around m-1">
              <StatesDiv
                editableState={editableState}
                setEditableState={setEditableState}
                shouldSanitize={shouldSanitize}
                setShouldSanitize={setShouldSanitize}
              />
              <div className="flex-center">
                <SendButton
                  messages={messages}
                  setMessages={setMessages}
                  apiType={apiType}
                  model={model}
                  temperature={temperature}
                  stream={stream}
                />
                <ClearButton setMessages={setMessages}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Chat;