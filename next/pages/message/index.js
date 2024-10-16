import React, {useEffect, useState} from 'react';
import MessageClient from "../../src/message/MessageClient";
import UserLogic from "../../src/common/user/UserLogic";
import MessageDiv from '../../app/components/message/MessageDiv';
import {ThemeProvider} from "@mui/material/styles";
import {Alert, Button, CssBaseline, Paper, Snackbar, Typography} from "@mui/material";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../app/hooks/useThemeHandler";

function MessageTransmitter() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [newMessage, setNewMessage] = useState({username: '', content: ''});
  const messageService = new MessageClient();

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
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
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

  const handleNewMessageRoleChange = (username) => {
    setNewMessage(prev => ({...prev, username}));
  }

  const handleNewMessageContentChange = (content) => {
    setNewMessage(prev => ({...prev, content}));
  };

  const handleFileUpload = (fileUrls) => {
    const updatedContent = `${newMessage.content}\n${fileUrls.join('\n')}`;
    setNewMessage(prev => ({...prev, content: updatedContent}));
  }

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Message Transmitter"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable">
          <div className="m-4">
            <Typography variant="h4" className="text-center">Receive Messages</Typography>
            <Paper elevation={1} className="m-2 p-4 rounded-lg">
              {messages.map(message => (
                <MessageDiv
                  key={message.id}
                  role={message.username}
                  setRole={() => {
                  }}
                  content={message.content}
                  setContent={() => {
                  }}
                />
              ))}
            </Paper>
            <div className="flex-center">
              <div className="m-1"><Button variant="contained" color="primary" onClick={fetchMessages}>Receive</Button>
              </div>
              <div className="m-1"><Button variant="contained" color="secondary"
                                           onClick={handleClearMessages}>Clear</Button></div>
            </div>
          </div>
          <div className="m-4">
            <Typography variant="h4" className="text-center">Send Messages</Typography>
            <MessageDiv
              role={newMessage.username}
              setRole={handleNewMessageRoleChange}
              content={newMessage.content}
              setContent={handleNewMessageContentChange}
              setFiles={handleFileUpload}
            />
            <div className="text-center">
              <Button id="send" variant="outlined" onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default MessageTransmitter;