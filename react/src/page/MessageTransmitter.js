import React, { useState, useEffect } from 'react';
import { MessageService } from "../service/MessageService";
import { AuthManager } from "../manager/AuthManager";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';
import MessageDiv from '../component/MessageDiv';

function MessageTransmitter() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [newMessage, setNewMessage] = useState({ role: '', content: '' });
  const messageService = new MessageService();

  const authManager = new AuthManager();

  useEffect(() => {
    fetchMessages();
    fetchUsername();
  }, []);

  const fetchMessages = async () => {
    const fetchedMessages = await messageService.fetchMessages();
    setMessages(fetchedMessages.map(msg => ({ ...msg, editing: false })));
  };

  const fetchUsername = async () => {
    const fetchedUsername = await authManager.fetchUsername();
    setUsername(fetchedUsername);
  };

  const handleSendMessage = async () => {
    // Send the message stored in newMessage
    await messageService.sendMessage(newMessage.role, newMessage.content); // Replace 'username' with actual username
    setNewMessage({ role: '', content: '' }); // Clear the new message
    fetchMessages();
  };

  const handleClearMessages = async () => {
    await messageService.deleteMessages();
    fetchMessages();
  };

  // Handler for when the content of the new message is changed
  const onNewMessageRoleChange = (role) => {
    setNewMessage(prev => ({ ...prev, role }));
  }

  const onNewMessageContentChange = (content) => {
    setNewMessage(prev => ({ ...prev, content }));
  };

  return (
    <div>
      <h1 className="center">Message Transmitter</h1>
      <div className="Flex-space-around">
        <AuthDiv />
        <ThemeSelect />
      </div>
      <div>
        <h2 className="center">Receive Messages</h2>
        <div className="rounded-border-container">
          {messages.map(msg => (
            <MessageDiv
              key={msg.id}
              roleInitial={msg.role}
              contentInitial={msg.content}
              onRoleChange={() => {}} // Role change handler if needed
              onContentChange={() => {}} // Content change handler if needed
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
          roleInitial={username}
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
