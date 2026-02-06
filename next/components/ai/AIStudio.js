import React, {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import {Collapse, Drawer, Paper} from "@mui/material";

import ChatLogic from "../../lib/chat/ChatLogic";
import ConfigDiv from "./ConfigDiv";
import SendButton from "./SendButton";
import RetryButton from "./RetryButton";
import ChatMessagesDiv from "./ChatMessagesDiv";
import ConversationSidebar from "./conversation-sidebar/ConversationSidebar";
import ToggleConversationButton from "./ToggleConversationButton";
import useScreenSize from '../common/hooks/useScreenSize';
import AIStudioTour from './AIStudioTour';
import ScrollToBottomButton from './ScrollToBottomButton';
import NewConversationButton from "./conversation-sidebar/NewConversationButton";
import TemporaryChatButton from "./TemporaryChatButton";

function AIStudio({
                  initMessages = null,
                  initIsTemporaryChat = false,
                }) {
  const screenSize = useScreenSize();
  const [drawerOpen, setDrawerOpen] = useState(() => {
    return screenSize === 'xs' || screenSize === 'sm' ? false : true;
  });

  // Chat Parameters
  const [messages, setMessages] = useState(initMessages);
  const [apiType, setApiType] = useState(ChatLogic.defaultApiTypeModels[0].apiType);
  const [model, setModel] = useState(ChatLogic.defaultApiTypeModels[0].model);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);
  const [thought, setThought] = useState(true);
  const [codeExecution, setCodeExecution] = useState(false);
  const [isTemporaryChat, setIsTemporaryChat] = useState(initIsTemporaryChat);

  // Generation Control
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  // Thought Loading
  const [isLastChunkThought, setIsLastChunkThought] = useState(false);

  // Conversation
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversationUpdateKey, setConversationUpdateKey] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [conversationsReloadKey, setConversationsReloadKey] = useState(0);
  const [promptsReloadKey, setPromptsReloadKey] = useState(0);
  const conversationUpdatePromiseRef = useRef(null);
  const conversationVersionRef = useRef({});

  // Credit refresh
  const [creditRefreshKey, setCreditRefreshKey] = useState(0);

  // Ref for handleGenerate function
  const handleGenerateRef = useRef(null);
  const clearUIStateRef = useRef(null);

  // Refresh conversations when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setConversationsReloadKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="local-scroll-container">
      <Head>
        <meta
          name="description"
          content="PolyFlexLLM by windsnow1025. A unified web UI for native interactions with various LLM providers (OpenAI, Gemini, Claude, Grok), offering full context control, Markdown + LaTeX rendering, multimodal I/O, file processing, and stream output."
        />
        <title>PolyFlexLLM - Windsnow1025</title>
      </Head>
      <div className="local-scroll-unscrollable-x">
        {screenSize === 'xs' || screenSize === 'sm' ? (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{zIndex: 1202}}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <ConversationSidebar
              messages={messages}
              setMessages={setMessages}
              selectedConversationId={selectedConversationId}
              setSelectedConversationId={setSelectedConversationId}
              conversationUpdateKey={conversationUpdateKey}
              conversationUpdatePromiseRef={conversationUpdatePromiseRef}
              conversationVersionRef={conversationVersionRef}
              conversations={conversations}
              setConversations={setConversations}
              conversationsReloadKey={conversationsReloadKey}
              setConversationsReloadKey={setConversationsReloadKey}
              setIsTemporaryChat={setIsTemporaryChat}
              clearUIStateRef={clearUIStateRef}
            />
          </Drawer>
        ) : (
          <Paper elevation={2} sx={{borderRadius: 0}} className="flex">
            <Collapse orientation="horizontal" in={drawerOpen}>
              <ConversationSidebar
                messages={messages}
                setMessages={setMessages}
                selectedConversationId={selectedConversationId}
                setSelectedConversationId={setSelectedConversationId}
                conversationUpdateKey={conversationUpdateKey}
                conversationUpdatePromiseRef={conversationUpdatePromiseRef}
                conversationVersionRef={conversationVersionRef}
                conversations={conversations}
                setConversations={setConversations}
                conversationsReloadKey={conversationsReloadKey}
                setConversationsReloadKey={setConversationsReloadKey}
                setIsTemporaryChat={setIsTemporaryChat}
                clearUIStateRef={clearUIStateRef}
              />
            </Collapse>
          </Paper>
        )}
        <div className="local-scroll-unscrollable-y relative">
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
                thought={thought}
                setThought={setThought}
                codeExecution={codeExecution}
                setCodeExecution={setCodeExecution}
                refreshKey={creditRefreshKey}
              />
            </div>
          </div>
          <Paper elevation={0} className="local-scroll-scrollable px-1" id="chat-messages">
            {messages !== null ? (
              <ChatMessagesDiv
                messages={messages}
                setMessages={setMessages}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                isGeneratingRef={isGeneratingRef}
                setConversationUpdateKey={setConversationUpdateKey}
                promptsReloadKey={promptsReloadKey}
                setPromptsReloadKey={setPromptsReloadKey}
                isTemporaryChat={isTemporaryChat}
                isLastChunkThought={isLastChunkThought}
              />
            ) : (
              <div className="flex-around h-full">
                <NewConversationButton
                  setMessages={setMessages}
                  setConversations={setConversations}
                  setSelectedConversationId={setSelectedConversationId}
                  setConversationsReloadKey={setConversationsReloadKey}
                  setIsTemporaryChat={setIsTemporaryChat}
                  buttonStyle="main"
                  clearUIStateRef={clearUIStateRef}
                />
                <TemporaryChatButton
                  setMessages={setMessages}
                  setSelectedConversationId={setSelectedConversationId}
                  setIsTemporaryChat={setIsTemporaryChat}
                  buttonStyle="main"
                  clearUIStateRef={clearUIStateRef}
                />
              </div>
            )}
          </Paper>

          <ScrollToBottomButton/>
          <AIStudioTour/>

          <div className="flex-around">
            <div className="flex-center">
              <SendButton
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                isGeneratingRef={isGeneratingRef}
                setIsLastChunkThought={setIsLastChunkThought}
                setConversationsReloadKey={setConversationsReloadKey}
                setCreditRefreshKey={setCreditRefreshKey}
                handleGenerateRef={handleGenerateRef}
                clearUIStateRef={clearUIStateRef}
                isTemporaryChat={isTemporaryChat}
                selectedConversationId={selectedConversationId}
                conversations={conversations}
                conversationUpdatePromiseRef={conversationUpdatePromiseRef}
                conversationVersionRef={conversationVersionRef}
                messages={messages}
                setMessages={setMessages}
                apiType={apiType}
                model={model}
                temperature={temperature}
                stream={stream}
                thought={thought}
                codeExecution={codeExecution}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIStudio;
