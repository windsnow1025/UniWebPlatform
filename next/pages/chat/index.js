import React, {useEffect, useRef, useState} from 'react';
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
import {RoleEditableState} from "../../src/conversation/chat/Message";
import useScreenSize from '../../app/hooks/useScreenSize';

function AIChat() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const screenSize = useScreenSize();
  const [drawerOpen, setDrawerOpen] = useState();
  const title = "Windsnow AI Chat";

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    setDrawerOpen(screenSize !== 'xs' && screenSize !== 'sm');
  }, [screenSize]);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState(chatLogic.initMessages);
  const [apiType, setApiType] = useState(chatLogic.defaultApiModels[0].api_type);
  const [model, setModel] = useState(chatLogic.defaultApiModels[0].model);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // States
  const [roleEditableState, setRoleEditableState] = useState(RoleEditableState.RoleBased);
  const [shouldSanitize, setShouldSanitize] = useState(true);

  // Generation Control
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  // Conversation
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversationUpdateTrigger, setConversationUpdateTrigger] = useState(false);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar title={title} infoUrl={"/markdown/view/chat-doc.md"}/>
        <div className="local-scroll-unscrollable-x">
          <Paper elevation={2} sx={{borderRadius: 0}} className="flex">
            <Collapse orientation="horizontal" in={drawerOpen}>
              <ConversationSidebar
                messages={messages}
                setMessages={setMessages}
                selectedConversationId={selectedConversationId}
                setSelectedConversationId={setSelectedConversationId}
                conversationUpdateTrigger={conversationUpdateTrigger}
                setConversationUpdateTrigger={setConversationUpdateTrigger}
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
                  roleEditableState={roleEditableState}
                  setIsGenerating={setIsGenerating}
                  isGeneratingRef={isGeneratingRef}
                  setConversationUpdateTrigger={setConversationUpdateTrigger}
                />
              </div>
            </Paper>
            <div className="flex-around m-1">
              <StatesDiv
                roleEditableState={roleEditableState}
                setRoleEditableState={setRoleEditableState}
                shouldSanitize={shouldSanitize}
                setShouldSanitize={setShouldSanitize}
              />
              <div className="flex-center">
                <SendButton
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                  isGeneratingRef={isGeneratingRef}
                  setConversationUpdateTrigger={setConversationUpdateTrigger}
                  messages={messages}
                  setMessages={setMessages}
                  apiType={apiType}
                  model={model}
                  temperature={temperature}
                  stream={stream}
                />
                <ClearButton
                  setMessages={setMessages}
                  setIsGenerating={setIsGenerating}
                  isGeneratingRef={isGeneratingRef}
                  setSelectedConversationId={setSelectedConversationId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AIChat;