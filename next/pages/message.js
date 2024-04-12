import '../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import MessageService from "../src/service/MessageService";
import {UserLogic} from "../src/logic/UserLogic";
import MessageDiv from '../app/components/message/MessageDiv';
import {ThemeProvider} from "@mui/material/styles";
import {Button, CssBaseline, Paper, Typography} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import {createMUITheme} from "../app/utils/Theme";

function MessageTransmitter() {
  const [systemTheme, setSystemTheme] = useState();
  const [muiTheme, setMuiTheme] = useState();

  useEffect(() => {
    setMuiTheme(createMUITheme(systemTheme));
  }, [systemTheme]);

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
  }, []);

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
    const updatedContent = `${newMessage.content}${fileUrl}`;
    setNewMessage(prev => ({...prev, content: updatedContent}));
  }

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme />
          <HeaderAppBar
            title="Message Transmitter"
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <div className="m-4">
            <Typography variant="h4" className="text-center">Receive Messages</Typography>
            <Paper elevation={1} className="m-2 p-4 rounded-lg">
              {messages.map(message => (
                <MessageDiv
                  key={message.id}
                  roleInitial={message.username}
                  contentInitial={message.content}
                  onRoleChange={() => {}}
                  onContentChange={() => {}}
                />
              ))}
            </Paper>
            <div className="flex-center">
              <div className="m-1"><Button variant="contained" color="primary" onClick={fetchMessages}>Receive</Button></div>
              <div className="m-1"><Button variant="contained" color="secondary" onClick={handleClearMessages}>Clear</Button></div>
            </div>
          </div>
          <div className="m-4">
            <Typography variant="h4" className="text-center">Send Messages</Typography>
            <MessageDiv
              roleInitial={newMessage.username}
              contentInitial={newMessage.content}
              onRoleChange={onNewMessageRoleChange}
              onContentChange={onNewMessageContentChange}
              onFileUpload={onFileUpload}
            />
            <div className="text-center">
              <Button id="send" variant="outlined" onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </ThemeProvider>
      }
    </>
  );
}

export default MessageTransmitter;
