import '../src/asset/css/index.css';
import '../src/asset/css/markdown.css';

import React, {useEffect, useRef, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {Button, Checkbox, CssBaseline, FormControlLabel, IconButton, Paper, Tooltip} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import {ChatLogic} from "../src/logic/ChatLogic";
import UserService from "../src/service/UserService";
import MessageDiv from "../app/components/message/MessageDiv";
import ConversationAutocomplete from "../app/components/ConversationAutocomplete";
import Snackbar from "@mui/material/Snackbar";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import ChatSettings from "../app/components/ChatSettings";
import useThemeHandler from "../app/hooks/useThemeHandler";

function Chat() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const chatLogic = new ChatLogic();
  const userService = new UserService();

  const title = "AI Chat";

  // Fetch Data
  const [apiModels, setApiModels] = useState([]);
  const [fullModels, setFullModels] = useState([]);

  // Chat Parameters
  const [messages, setMessages] = useState(chatLogic.initMessages);
  const [apiType, setApiType] = useState(chatLogic.defaultApiType);
  const [model, setModel] = useState(chatLogic.defaultModel);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // States
  const [credit, setCredit] = useState(0);
  const [generate, setGenerate] = useState("Generate");
  const [editable, setEditable] = useState(true);
  const [sanitize, setSanitize] = useState(true);

  // Abort controller
  const currentRequestIndex = useRef(0);
  const isRequesting = useRef(false);

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      const fullModels = await chatLogic.fetchModels();
      setFullModels(fullModels);
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const fetchCredit = async () => {
      if (localStorage.getItem('token')) {
        const credit = await userService.fetchCredit();
        setCredit(credit);
      }
    };

    fetchCredit();
  }, [generate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        document.activeElement.blur();
        const generateButton = document.getElementById('generate');
        setTimeout(() => generateButton.click(), 0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [messages]);

  useEffect(() => {
    setApiModels(chatLogic.getModels(fullModels, apiType));
    setModel(chatLogic.getModels(chatLogic.defaultModel, apiType)[0]);
  }, [fullModels, apiType]);

  useEffect(() => {
    const contentEditableValue = editable ? 'plaintext-only' : 'false';
    const contentEditableElements = document.querySelectorAll('[contenteditable]');

    contentEditableElements.forEach(element => {
      element.setAttribute('contenteditable', contentEditableValue);
    });
  }, [editable]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const startGenerate = async () => {
    if (!localStorage.getItem('token')) {
      setAlertMessage('Please sign in first.');
      setAlertOpen(true);
      return;
    }

    setGenerate("Stop");

    isRequesting.current = true;
    currentRequestIndex.current += 1;
    const thisRequestIndex = currentRequestIndex.current;

    if (!stream) {

      const content = await chatLogic.nonStreamGenerate(messages, apiType, model, temperature, stream);

      if (!(thisRequestIndex === currentRequestIndex.current && isRequesting.current)) {
        return;
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.createAssistantMessage(content), chatLogic.emptyUserMessage]);

    } else {

      let isFirstChunk = true;

      for await (const chunk of chatLogic.streamGenerate(messages, apiType, model, temperature, stream)) {

        if (!(thisRequestIndex === currentRequestIndex.current && isRequesting.current)) {
          return;
        }

        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

        if (isFirstChunk) {
          setMessages(prevMessages => [...prevMessages, chatLogic.emptyAssistantMessage]);
          isFirstChunk = false;
        }

        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });

        if (isAtBottom) window.scrollTo(0, document.body.scrollHeight);
      }

      setMessages(prevMessages => [...prevMessages, chatLogic.emptyUserMessage]);

    }

    window.scrollTo(0, document.body.scrollHeight);
  }

  const stopGenerate = () => {
    isRequesting.current = false;
    setGenerate("Generate");
  }

  const handleGenerate = async () => {
    if (generate === "Generate") {
      try {
        await startGenerate();
      } catch (error) {
        setAlertMessage(error.message);
        setAlertOpen(true);
      } finally {
        setGenerate("Generate");
      }
    } else {
      stopGenerate();
    }
  };

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

  const handleConversationUpload = async () => {
    const messages = await chatLogic.import();
    setMessages(messages);
  };

  const handleConversationDownload = async () => {
    chatLogic.export(messages);
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
        <div className="flex-around m-2">
          <a href="/markdown/view/chat-doc.md" target="_blank" rel="noopener noreferrer">
            <div className="flex-center">
              <div>Document</div>
              <LinkIcon/>
            </div>
          </a>
          <a href="/markdown/view/chat-presets.md" target="_blank" rel="noopener noreferrer">
            <div className="flex-center">
              <div>Presets</div>
              <LinkIcon/>
            </div>
          </a>
          <div>Credit: {credit}</div>
        </div>
        <ChatSettings
          apiType={apiType}
          setApiType={setApiType}
          model={model}
          setModel={setModel}
          apiModels={apiModels}
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
            <div className="m-2">
              <Button id="generate" variant="contained" color="primary" onClick={handleGenerate}>{generate}</Button>
            </div>
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
          <div>
            <Tooltip title="Export">
              <IconButton aria-label="download" onClick={handleConversationDownload}>
                <DownloadIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Import">
              <IconButton aria-label="upload" onClick={handleConversationUpload}>
                <UploadIcon/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="text-center m-1">
          <span className="text-center m-1">windsnow1024@gmail.com</span>
          <a href="https://github.com/windsnow1025/FullStack-Web" target="_blank" rel="noopener noreferrer"><GitHubIcon/></a>
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