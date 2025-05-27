import React, {useEffect, useRef, useState} from 'react';
import {Collapse, Paper} from "@mui/material";

import ChatLogic from "../../lib/chat/ChatLogic";
import SettingsDiv from "../../components/chat/SettingsDiv";
import SendButton from "../../components/chat/SendButton";
import ChatMessagesDiv from "../../components/chat/ChatMessagesDiv";
import ClearButton from "../../components/chat/ClearButton";
import ConversationSidebar from "../../components/chat/conversation/ConversationSidebar";
import ToggleConversationButton from "../../components/chat/conversation/ToggleConversationButton";
import useScreenSize from '../../components/common/hooks/useScreenSize';

function AIChat() {
  const screenSize = useScreenSize();
  const [drawerOpen, setDrawerOpen] = useState();
  const title = "AI Studio";

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    setDrawerOpen(screenSize !== 'xs' && screenSize !== 'sm');
  }, [screenSize]);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState(chatLogic.initMessages);
  const [apiType, setApiType] = useState(chatLogic.defaultApiTypeModels[0].apiType);
  const [model, setModel] = useState(chatLogic.defaultApiTypeModels[0].model);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // Generation Control
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  // Conversation
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversationUpdateTrigger, setConversationUpdateTrigger] = useState(false);

  return (
    <div className="local-scroll-container">
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
          <Paper elevation={0} className="rounded-lg local-scroll-unscrollable-y">
            <div className="local-scroll-scrollable px-1" id="chat-messages">
              <ChatMessagesDiv
                messages={messages}
                setMessages={setMessages}
                setIsGenerating={setIsGenerating}
                isGeneratingRef={isGeneratingRef}
                setConversationUpdateTrigger={setConversationUpdateTrigger}
              />
            </div>
          </Paper>
          <div className="flex-around">
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
  );
}

export default AIChat;
