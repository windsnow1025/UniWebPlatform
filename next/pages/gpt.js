import '../src/asset/css/index.css';
import '../src/asset/css/markdown.css';

import React, {useState, useEffect, useRef} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {
  AppBar,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem, Paper,
  Select,
  Slider,
  Switch, Tooltip,
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import {GPTLogic} from "../src/logic/GPTLogic";
import UserService from "../src/service/UserService";
import AuthDiv from '../app/components/AuthDiv';
import ThemeSelect from '../app/components/ThemeSelect';
import MessageDiv from "../app/components/MessageDiv";
import ConversationAutocomplete from "../app/components/ConversationAutocomplete";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import Snackbar from "@mui/material/Snackbar";

function GPT() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const gptLogic = new GPTLogic();

  const [apiModels, setApiModels] = useState([]);
  const [fullModels, setFullModels] = useState([]);

  // GPT Parameters
  const [messages, setMessages] = useState(gptLogic.initMessages);
  const [apiType, setApiType] = useState(gptLogic.defaultApiType);
  const [model, setModel] = useState(gptLogic.defaultModel);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // Others
  const [credit, setCredit] = useState(0);
  const [generate, setGenerate] = useState("Generate");
  const [editable, setEditable] = useState(true);
  const [sanitize, setSanitize] = useState(true);

  // Abort controller
  const currentRequestIndex = useRef(0);
  const isRequesting = useRef(false);

  const userService = new UserService();

  useEffect(() => {
    document.title = "GPT";
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      const fullModels = await gptLogic.fetchModels();
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
  }, [messages]);

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
    setApiModels(gptLogic.getModels(fullModels, apiType));
    setModel(gptLogic.getModels(gptLogic.defaultModel, apiType)[0]);
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

      const content = await gptLogic.nonStreamGenerate(messages, apiType, model, temperature, stream);

      if (!(thisRequestIndex === currentRequestIndex.current && isRequesting.current)) {
        return;
      }

      setMessages(prevMessages => [...prevMessages, {
        "role": "assistant",
        "content": content
      }, gptLogic.emptyUserMessage]);

    } else {

      let isFirstChunk = true;

      for await (const chunk of gptLogic.streamGenerate(messages, apiType, model, temperature, stream)) {

        if (!(thisRequestIndex === currentRequestIndex.current && isRequesting.current)) {
          return;
        }

        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

        if (isFirstChunk) {
          setMessages(prevMessages => [...prevMessages, gptLogic.emptyAssistantMessage]);
          isFirstChunk = false;
        }

        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content += chunk;
          return newMessages;
        });

        if (isAtBottom) window.scrollTo(0, document.body.scrollHeight);
      }

      setMessages(prevMessages => [...prevMessages, gptLogic.emptyUserMessage]);

    }

    window.scrollTo(0, document.body.scrollHeight);
    setGenerate("Generate");
  }

  const stopGenerate = () => {
    isRequesting.current = false;
    setGenerate("Generate");
  }

  const handleGenerate = async () => {
    if (generate === "Generate") {
      startGenerate();
    } else {
      stopGenerate();
    }
  };

  const handleClear = () => {
    setMessages(gptLogic.initMessages);
  };

  const handleRoleChange = (index, role) => {
    const newMessages = [...messages];
    newMessages[index].role = role;
    setMessages(newMessages);
  };

  const handleContentChange = (index, content) => {
    const newMessages = [...messages];
    newMessages[index].content = content;
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
    newMessages.splice(index + 1, 0, gptLogic.emptyUserMessage);
    setMessages(newMessages);
  };

  const onConversationOptionClick = async (conversation) => {
    setMessages(conversation.conversation);
  };

  const handleConversationUpload = async () => {
    const messages = await gptLogic.import();
    setMessages(messages);
  };

  const handleConversationDownload = async () => {
    gptLogic.export(messages);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <div className="flex-around p-2">
          <h1 className="grow">WindsnowGPT</h1>
          <div className="m-1"><AuthDiv/></div>
          <div className="m-1"><ThemeSelect/></div>
        </div>
      </AppBar>
      <br/>
      <div className="flex-around m-1">
        <a href="/markdown-view?filename=gpt-documentation.md" target="_blank" rel="noopener noreferrer">
          <div className="flex-center">
            <div>Docs</div>
            <LinkIcon/>
          </div>
        </a>
        <a href="/markdown-view?filename=gpt-presets.md" target="_blank" rel="noopener noreferrer">
          <div className="flex-center">
            <div>Presets</div>
            <LinkIcon/>
          </div>
        </a>
        <div>Credit: {credit}</div>
      </div>
      <div className="flex-around m-2">
        <div className="m-1">
          <FormControl fullWidth className="mt-2">
            <InputLabel id="api-type-select-label">API Type</InputLabel>
            <Select
              labelId="api-type-select-label"
              id="api-type-select"
              value={apiType}
              label="API Type"
              onChange={e => setApiType(e.target.value)}
            >
              <MenuItem value="open_ai">Open AI</MenuItem>
              <MenuItem value="azure">Azure</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="m-1">
          <FormControl fullWidth className="mt-2">
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={apiModels.length !== 0 ? model : ''}
              label="Model"
              onChange={e => setModel(e.target.value)}
            >
              {apiModels.length !== 0 && apiModels.map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="m-1">
          <InputLabel htmlFor="temperature">Temperature: {temperature.toFixed(1)}</InputLabel>
          <Slider
            aria-label="Temperature"
            value={temperature}
            onChange={(e, newValue) => setTemperature(newValue)}
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0}
            max={2}
          />
        </div>
        <div>
          <FormControlLabel control={
            <Switch checked={stream} onChange={e => setStream(e.target.checked)}/>
          } label="Stream"/>
        </div>
      </div>
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
                contentInitial={message.content}
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
  )
}

export default GPT;