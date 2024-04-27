import '../src/asset/css/index.css';
import '../src/asset/css/markdown.css';

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {Button, Checkbox, CssBaseline, FormControlLabel, IconButton, Paper, Tooltip, Snackbar} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import {ChatLogic} from "../src/logic/ChatLogic";
import MessageDiv from "../app/components/message/MessageDiv";
import ConversationAutocomplete from "../app/components/chat/ConversationAutocomplete";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import ChatSettings from "../app/components/chat/ChatSettings";
import useThemeHandler from "../app/hooks/useThemeHandler";
import ChatInformation from "../app/components/chat/ChatInformation";
import ChatGenerate from "../app/components/chat/ChatGenerate";

function Chat() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const title = "AI Chat";
  useEffect(() => {
    document.title = title;
  }, []);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState(chatLogic.initMessages);
  const [apiType, setApiType] = useState(chatLogic.defaultApiType);
  const [model, setModel] = useState(chatLogic.defaultApiModels);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // States
  const [editable, setEditable] = useState(true);
  const [sanitize, setSanitize] = useState(true);

  useEffect(() => {
    const contentEditableValue = editable ? 'plaintext-only' : 'false';
    const contentEditableElements = document.querySelectorAll('[contenteditable]');

    contentEditableElements.forEach(element => {
      element.setAttribute('contenteditable', contentEditableValue);
    });
  }, [editable]);

  const handleClear = () => {
    setMessages(chatLogic.initMessages);
  };

  const handleRoleChange = (index, role) => {
    const newMessages = [...messages];
    newMessages[index].role = role;
    setMessages(newMessages);
  };

  const handleContentChange = (index, content) => {
    const newMessages = [...messages];
    newMessages[index].text = content;
    setMessages(newMessages);
  };

  const handleMessageDelete = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const handleFileUpload = (index, fileUrl) => {
    const newMessages = [...messages];
    const currentMessage = newMessages[index];

    currentMessage.files = (currentMessage.files || []).concat(fileUrl);
    setMessages(newMessages);
  };

  const handleMessageAdd = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index + 1, 0, chatLogic.emptyUserMessage);
    setMessages(newMessages);
  };

  const onConversationOptionClick = async (conversation) => {
    setMessages(conversation.conversation);
  };

  return (
    <>
    {muiTheme &&
      <ThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        <HeaderAppBar
          title={title}
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <ChatInformation
          messages={messages}
        />
        <ChatSettings
          apiType={apiType}
          setApiType={setApiType}
          model={model}
          setModel={setModel}
          temperature={temperature}
          setTemperature={setTemperature}
          stream={stream}
          setStream={setStream}
        />
        <Paper elevation={1} className="m-2 p-4 rounded-lg">
          <div>
            <div className="flex-between">
              <div className="inflex-fill"/>
              <div className="inflex-end">
                <Tooltip title="Add">
                  <IconButton aria-label="add" onClick={() => handleMessageAdd(-1)}>
                    <AddCircleIcon fontSize="small"/>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            {messages.map((message, index) => (
              <div key={index}>
                <MessageDiv
                  roleInitial={message.role}
                  contentInitial={message.text}
                  filesInitial={message.files}
                  onRoleChange={(role) => handleRoleChange(index, role)}
                  onContentChange={(content) => handleContentChange(index, content)}
                  onFileUpload={(fileUrl) => {handleFileUpload(index, fileUrl)}}
                  useRoleSelect={true}
                  onMessageDelete={() => handleMessageDelete(index)}
                  shouldSanitize={sanitize}
                />
                <div className="flex-between">
                  <div className="inflex-fill"/>
                  <div className="inflex-end">
                    <Tooltip title="Add">
                      <IconButton aria-label="add" onClick={() => handleMessageAdd(index)}>
                        <AddCircleIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-center">
            <ChatGenerate
              messages={messages}
              setMessages={setMessages}
              apiType={apiType}
              model={model}
              temperature={temperature}
              stream={stream}
              setAlertMessage={setAlertMessage}
              setAlertOpen={setAlertOpen}
            />
            <div className="m-2">
              <Button variant="contained" color="secondary" onClick={handleClear}>Clear</Button>
            </div>
          </div>
        </Paper>
        <div className="flex-around m-1">
          <div>
            <FormControlLabel control={
              <Checkbox id="editable-check-box" checked={editable} onChange={e => setEditable(e.target.checked)}/>
            } label="Editable"/>
            <FormControlLabel control={
              <Checkbox id="sanitize-check-box" checked={sanitize} onChange={e => setSanitize(e.target.checked)}/>
            } label="Sanitize"/>
          </div>
          <ConversationAutocomplete
            conversation={messages}
            onConversationClick={onConversationOptionClick}
          />
        </div>
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={() => setAlertOpen(false)}
          message={alertMessage}
        />
      </ThemeProvider>
    }
    </>
  )
}

export default Chat;