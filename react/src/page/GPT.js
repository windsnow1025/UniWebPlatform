import React, {useState, useEffect} from 'react';
import UserService from "../service/UserService";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';
import MessageDiv from "../component/MessageDiv";
import axios from 'axios';

function GPT() {
  const [messages, setMessages] = useState([
    {
      "role": "system",
      "content": "You are a helpful assistant."
    }
  ]);
  const [apiType, setApiType] = useState('open_ai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  const [credit, setCredit] = useState(0);
  const [status, setStatus] = useState('Ready');

  const userService = new UserService();

  useEffect(() => {
    fetchCredit();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        document.activeElement.blur();
        handleGenerate();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [messages]);

  const fetchCredit = async () => {
    if (localStorage.getItem('token')) {
      const credit = await userService.fetchCredit();
      setCredit(credit);
    }
  }

  const handleGenerate = async () => {
    // Generate
    console.log('Generate');
  }

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
          <select name="model" value={model} onChange={e => setModel(e.target.value)}></select>
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
        {/*  Message Div  */}
        </div>
        <div className="center">
          <button type="button" title="Ctrl + Enter" onClick={handleGenerate}>Generate</button>
          <div><small>Status: {status}</small></div>
        </div>
      </div>
    </div>
  )
}

export default GPT;