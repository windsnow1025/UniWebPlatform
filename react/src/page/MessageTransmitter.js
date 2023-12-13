import React, {useState, useEffect} from 'react';
import {MessageService} from "../service/MessageService";
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

  useEffect(() => {
    fetchMessages();
    fetchUsername();
  });

  const fetchMessages = async () => {
    const fetchedMessages = await messageService.fetchMessages();
    setMessages(fetchedMessages);
  };

  const fetchUsername = async () => {
    const fetchedUsername = await userLogic.fetchUsername();
    setUsername(fetchedUsername);
    setNewMessage(prev => ({...prev, username: fetchedUsername}));
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
