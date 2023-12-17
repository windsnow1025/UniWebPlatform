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
  MenuItem,
  Select,
  Slider,
  Switch
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import GitHubIcon from '@mui/icons-material/GitHub';
import {GPTLogic} from "../logic/GPTLogic";
import UserService from "../service/UserService";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';
import MessageDiv from "../component/MessageDiv";
import ConversationAutocomplete from "../component/ConversationAutocomplete";
import {getInitMUITheme} from "../logic/ThemeLogic";

function GPT() {
  const [theme, setTheme] = useState(getInitMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
  }, []);

  const gptLogic = new GPTLogic();

  // GPT Parameters
  const [messages, setMessages] = useState(gptLogic.initMessages);
  const [apiType, setApiType] = useState('open_ai');
  const [model, setModel] = useState(gptLogic.models.open_ai[0]);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // Others
  const [credit, setCredit] = useState(0);
  const [generate, setGenerate] = useState("Generate");
  const [status, setStatus] = useState('Ready');
  const [isEditable, setIsEditable] = useState(true);

  // Abort controller
  const currentRequestIndex = useRef(0);
  const isRequesting = useRef(false);

  const userService = new UserService();

  useEffect(() => {
    document.title = "GPT";
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
    setModel(gptLogic.models[apiType][0]);
  }, [apiType]);

  useEffect(() => {
    const contentEditableValue = isEditable ? 'plaintext-only' : 'false';
    const contentEditableElements = document.querySelectorAll('[contenteditable]');

    contentEditableElements.forEach(element => {
      element.setAttribute('contenteditable', contentEditableValue);
    });
  }, [isEditable]);

  const startGenerate = async () => {
    if (!localStorage.getItem('token')) {
      alert('Please login first.');
      return;
    }

    setGenerate("Stop");
    setStatus('Generating...');

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
      }, {
        "role": "user",
        "content": ""
      }]);

    } else {

      let isFirstChunk = true;

      for await (const chunk of gptLogic.streamGenerate(messages, apiType, model, temperature, stream)) {

        if (!(thisRequestIndex === currentRequestIndex.current && isRequesting.current)) {
          return;
        }

        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

        if (isFirstChunk) {
          setMessages(prevMessages => [...prevMessages, {
            "role": "assistant",
            "content": ""
          }]);
          isFirstChunk = false;
        }

        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content += chunk;
          return newMessages;
        });

        if (isAtBottom) window.scrollTo(0, document.body.scrollHeight);
      }

      setMessages(prevMessages => [...prevMessages, {
        "role": "user",
        "content": ""
      }]);

    }

    window.scrollTo(0, document.body.scrollHeight);
    setGenerate("Generate");
    setStatus('Ready');
  }

  const stopGenerate = () => {
    isRequesting.current = false;
    setGenerate("Generate");
    setStatus('Ready');
  }

  const handleGenerate = async () => {
    if (generate === "Generate") {
      startGenerate();
    } else {
      stopGenerate();
    }
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

  const handleContentDelete = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const handleMessageAdd = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index + 1, 0, {
      "role": "user",
      "content": ""
    });
    setMessages(newMessages);
  };

  const onConversationOptionClick = async (conversation) => {
    setMessages(conversation.conversation);
  };

  const handleConversationUpload = async () => {
    const messages = await gptLogic.upload();
    setMessages(messages);
  };

  const handleConversationDownload = async () => {
    gptLogic.download(messages);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" className="Flex-Center">
        <h1 className="center">WindsnowGPT</h1>
      </AppBar>
      <div className="Flex-space-around" style={{margin: 4}}>
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <br/>
      <div className="Flex-space-around" style={{margin: 4}}>
        <a href="/markdown/view/gpt-documentation.md" target="_blank" rel="noopener noreferrer">Documentation</a>
        <a href="/markdown/view/gpt-presets.md" target="_blank" rel="noopener noreferrer">System Presets</a>
        <div>Credit: {credit}</div>
      </div>
      <div className="Flex-space-around" style={{margin: 4}}>
        <div style={{margin: 4}}>
          <FormControl fullWidth>
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
        <div style={{margin: 4}}>
          <FormControl fullWidth>
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={model}
              label="Model"
              onChange={e => setModel(e.target.value)}
            >
              {(apiType === 'open_ai' ? gptLogic.models.open_ai : gptLogic.models.azure).map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{margin: 16}}>
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
      <div className="rounded-border-container">
        <h3>Conversations:</h3>
        <div>
          <div className="Flex-space-between">
            <div className="inFlex-FillSpace"/>
            <div className="Flex-Column inFlex-flex-end">
              <IconButton aria-label="add" onClick={() => handleMessageAdd(-1)}>
                <AddCircleIcon fontSize="small"/>
              </IconButton>
            </div>
          </div>
          {messages.map((message, index) => (
            <div key={index}>
              <MessageDiv
                roleInitial={message.role}
                contentInitial={message.content}
                onRoleChange={(role) => handleRoleChange(index, role)}
                onContentChange={(content) => handleContentChange(index, content)}
                useRoleSelect={true}
                onContentDelete={() => handleContentDelete(index)}
              />
              <div className="Flex-space-between">
                <div className="inFlex-FillSpace"/>
                <div className="Flex-Column inFlex-flex-end">
                  <IconButton aria-label="add" onClick={() => handleMessageAdd(index)}>
                    <AddCircleIcon fontSize="small"/>
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="center">
          <Button id="generate" variant="contained" onClick={handleGenerate}>{generate}</Button>
          <div><small>Status: {status}</small></div>
        </div>
      </div>
      <div className="Flex-space-around" style={{margin: 8}}>
        <div>
          <FormControlLabel control={
            <Checkbox id="editable-check-box" checked={isEditable} onChange={e => setIsEditable(e.target.checked)}/>
          } label="Editable"/>
        </div>
        <ConversationAutocomplete
          conversation={messages}
          onConversationClick={onConversationOptionClick}/>
        <div>
          <IconButton aria-label="download" onClick={handleConversationDownload}>
            <DownloadIcon/>
          </IconButton>
          <IconButton aria-label="upload" onClick={handleConversationUpload}>
            <UploadIcon/>
          </IconButton>
        </div>
      </div>
      <div className="center" style={{margin: 8}}>
        <span style={{margin: 8}}>windsnow1024@gmail.com</span>
        <a href="https://github.com/windsnow1025/FullStack-Web" target="_blank" rel="noopener noreferrer"><GitHubIcon/></a>
      </div>
    </ThemeProvider>
  )
}

export default GPT;