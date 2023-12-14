import React, {useState, useEffect} from 'react';
import MessageService from "../service/MessageService";
import {UserLogic} from "../logic/UserLogic";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';
import MessageDiv from '../component/MessageDiv';

function MessageTransmitter() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [newMessage, setNewMessage] = useState({username: '', content: ''});
  const messageService = new MessageService();

  const userLogic = new UserLogic();
  console.log("Refresh");

  useEffect(() => {
    fetchMessages();
    fetchUsername();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleSendMessage();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
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

  return (
    <div>
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
          <button type="button" onClick={fetchMessages}>Receive</button>
          <button type="button" onClick={handleClearMessages}>Clear</button>
        </div>
      </div>
      <div>
        <h2 className="center">Send Messages</h2>
        <MessageDiv
          roleInitial={newMessage.username}
          contentInitial={newMessage.content}
          onRoleChange={onNewMessageRoleChange}
          onContentChange={onNewMessageContentChange}
        />
        <div className="center">
          <button type="button" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default MessageTransmitter;
