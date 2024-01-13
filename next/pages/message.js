import '../src/asset/css/App.css';

import React, {useState, useEffect} from 'react';
import MessageService from "../src/service/MessageService";
import {UserLogic} from "../src/logic/UserLogic";
import AuthDiv from '../src/component/AuthDiv';
import ThemeSelect from '../src/component/ThemeSelect';
import MessageDiv from '../src/component/MessageDiv';
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Button} from "@mui/material";

function MessageTransmitter() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [newMessage, setNewMessage] = useState({username: '', content: ''});
  const messageService = new MessageService();

  const userLogic = new UserLogic();

  useEffect(() => {
    document.title = "Message Transmitter";
    fetchMessages();
    fetchUsername();
  }, []);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        document.activeElement.blur();
        const sendButton = document.getElementById('send');
        setTimeout(() => sendButton.click(), 0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [newMessage]);

  const fetchMessages = async () => {
    try {
      const messages = await messageService.fetchMessages();
      setMessages(messages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsername = async () => {
    const username = await userLogic.fetchUsername();
    if (username) {
      setUsername(username);
      setNewMessage(prev => ({...prev, username: username}));
    }
  };

  const handleSendMessage = async () => {
    await messageService.sendMessage(newMessage.username, newMessage.content);
    setNewMessage({username: username, content: ''});
    fetchMessages();
  };

  const handleClearMessages = async () => {
    await messageService.deleteMessages();
    fetchMessages();
  };

  const onNewMessageRoleChange = (username) => {
    setNewMessage(prev => ({...prev, username}));
  }

  const onNewMessageContentChange = (content) => {
    setNewMessage(prev => ({...prev, content}));
  };

  const onFileUpload = (fileUrl) => {
    const updatedContent = `${newMessage.content}\nfile: ${fileUrl}`;
    setNewMessage(prev => ({...prev, content: updatedContent}));
  }

  return (
    <ThemeProvider theme={theme}>
      <h1 className="center">Message Transmitter</h1>
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <div>
        <h2 className="center">Receive Messages</h2>
        <div className="rounded-border-container">
          {messages.map(message => (
            <MessageDiv
              key={message.id}
              roleInitial={message.username}
              contentInitial={message.content}
              onRoleChange={() => {}}
              onContentChange={() => {}}
            />
          ))}
        </div>
        <div className="center">
          <Button variant="outlined" onClick={fetchMessages} style={{margin: 4}}>Receive</Button>
          <Button variant="outlined" onClick={handleClearMessages} style={{margin: 4}}>Clear</Button>
        </div>
      </div>
      <div>
        <h2 className="center">Send Messages</h2>
        <MessageDiv
          roleInitial={newMessage.username}
          contentInitial={newMessage.content}
          onRoleChange={onNewMessageRoleChange}
          onContentChange={onNewMessageContentChange}
          onFileUpload={onFileUpload}
        />
        <div className="center">
          <Button id="send" variant="outlined" onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MessageTransmitter;
