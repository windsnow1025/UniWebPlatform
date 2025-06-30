import React, {useEffect, useRef, useState} from 'react';
import {Collapse, Paper} from "@mui/material";

import ChatLogic from "../../lib/chat/ChatLogic";
import ConfigDiv from "../../components/ai/ConfigDiv";
import SendButton from "../../components/ai/SendButton";
import RetryButton from "../../components/ai/RetryButton";
import ChatMessagesDiv from "../../components/ai/ChatMessagesDiv";
import ClearButton from "../../components/ai/ClearButton";
import ConversationSidebar from "../../components/ai/conversation/ConversationSidebar";
import ToggleConversationButton from "../../components/ai/conversation/ToggleConversationButton";
import useScreenSize from '../../components/common/hooks/useScreenSize';
import AIStudioTour from '../../components/ai/AIStudioTour';

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
  const [conversationUpdateKey, setConversationUpdateKey] = useState(0);

  // Credit refresh
  const [creditRefreshKey, setCreditRefreshKey] = useState(0);

  // Ref for handleGenerate function
  const handleGenerateRef = useRef(null);

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
              conversationUpdateKey={conversationUpdateKey}
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
              <ConfigDiv
                apiType={apiType}
                setApiType={setApiType}
                model={model}
                setModel={setModel}
                temperature={temperature}
                setTemperature={setTemperature}
                stream={stream}
                setStream={setStream}
                refreshKey={creditRefreshKey}
              />
            </div>
          </div>
          <Paper elevation={0} className="local-scroll-scrollable px-1" id="chat-messages">
            <ChatMessagesDiv
              messages={messages}
              setMessages={setMessages}
              setIsGenerating={setIsGenerating}
              isGeneratingRef={isGeneratingRef}
              setConversationUpdateKey={setConversationUpdateKey}
            />
          </Paper>
          <div className="flex-around">
            <div className="flex-center">
              <SendButton
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                isGeneratingRef={isGeneratingRef}
                setConversationUpdateKey={setConversationUpdateKey}
                setCreditRefreshKey={setCreditRefreshKey}
                handleGenerateRef={handleGenerateRef}
                messages={messages}
                setMessages={setMessages}
                apiType={apiType}
                model={model}
                temperature={temperature}
                stream={stream}
              />
              <RetryButton
                messages={messages}
                setMessages={setMessages}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                isGeneratingRef={isGeneratingRef}
                handleGenerate={() => handleGenerateRef.current && handleGenerateRef.current()}
              />
            </div>
            <ClearButton
              setMessages={setMessages}
              setIsGenerating={setIsGenerating}
              isGeneratingRef={isGeneratingRef}
              setSelectedConversationId={setSelectedConversationId}
            />
          </div>
        </div>
      </div>
      <AIStudioTour />
    </div>
  );
}

export default AIChat;
