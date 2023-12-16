import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle, faDownload, faUpload} from '@fortawesome/free-solid-svg-icons';
import {GPTLogic} from "../logic/GPTLogic";
import UserService from "../service/UserService";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';
import MessageDiv from "../component/MessageDiv";
import ConversationAutocomplete from "../component/ConversationAutocomplete";

function GPT() {
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

      setMessages(prevMessages => [...prevMessages, {
        "role": "assistant",
        "content": ""
      }]);

      for await (const chunk of gptLogic.streamGenerate(messages, apiType, model, temperature, stream)) {
        if (!(thisRequestIndex === currentRequestIndex.current && isRequesting.current)) {
          return;
        }

        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

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
    <div>
      <h1 className="center">WindsnowGPT</h1>
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <br/>
      <div className="Flex-space-around">
        <a href="/markdown/view/gpt-documentation.md" target="_blank" rel="noopener noreferrer">Documentation</a>
        <a href="/markdown/view/gpt-presets.md" target="_blank" rel="noopener noreferrer">System Presets</a>
        <div>Credit: {credit}</div>
      </div>
      <div className="Flex-space-around">
        <div>
          <label htmlFor="api_type">api_type: </label>
          <select name="api_type" value={apiType} onChange={e => setApiType(e.target.value)}>
            <option value="open_ai">open_ai</option>
            <option value="azure">azure</option>
          </select>
        </div>
        <div>
          <label htmlFor="model">model: </label>
          <select name="model" value={model} onChange={e => setModel(e.target.value)}>
            {(apiType === 'open_ai' ? gptLogic.models.open_ai : gptLogic.models.azure).map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="temperature">temperature: </label>
          <input type="range" min="0" max="2" step="0.1" value={temperature}
                 onChange={e => setTemperature(parseFloat(e.target.value))}/>
          <span>{temperature.toFixed(1)}</span>
        </div>
        <div>
          <label htmlFor="stream">stream</label>
          <input type="checkbox" checked={stream} onChange={e => setStream(e.target.checked)}/>
        </div>
      </div>
      <div className="rounded-border-container">
        <h3>Conversations:</h3>
        <div className="margin">
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
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    title="Add"
                    onClick={() => handleMessageAdd(index)}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="center">
          <button id="generate" type="button" title="Ctrl + Enter" onClick={handleGenerate}>{generate}</button>
          <div><small>Status: {status}</small></div>
        </div>
      </div>
      <div className="Flex-space-around">
        <div>
          <label htmlFor="editable">editable</label>
          <input type="checkbox" checked={isEditable} onChange={e => setIsEditable(e.target.checked)}/>
        </div>
        <ConversationAutocomplete
          conversation={messages}
          onConversationClick={onConversationOptionClick}/>
        <div>
          <FontAwesomeIcon
            icon={faDownload}
            style={{margin: "4px"}}
            title="Download"
            onClick={handleConversationDownload}/>
          <FontAwesomeIcon
            icon={faUpload}
            style={{margin: "4px"}}
            title="Upload"
            onClick={handleConversationUpload}/>
        </div>
      </div>
      <p className="center">Email: windsnow1024@gmail.com</p>
      <p className="center">GitHub: <a href="https://github.com/windsnow1025/FullStack-Web">https://github.com/windsnow1025/FullStack-Web</a></p>
    </div>
  )
}

export default GPT;