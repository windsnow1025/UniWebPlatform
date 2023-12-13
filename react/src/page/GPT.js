import React, {useState, useEffect} from 'react';
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
  const [api_type, setApi_type] = useState('open_ai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  return (
    <div>
      <h1 className="center">WindsnowGPT</h1>
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <div className="Flex-space-around">
        <a href="/markdown/view/gpt-documentation.md">Documentation</a>
        <a href="/markdown/view/gpt-presets.md">System Presets</a>
        <div>Credit</div>
      </div>

    </div>
  )
}

export default GPT;