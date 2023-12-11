import React, { useState, useEffect } from 'react';
import { MessageService } from "../service/MessageService";
import { AuthManager } from "../manager/AuthManager";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';

function MessageTransmitter() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState(null);
  const messageService = new MessageService();
  const authManager = new AuthManager();

  useEffect(() => {
    fetchMessages();
    fetchUsername();
  }, []);

  const fetchMessages = async () => {
    const fetchedMessages = await messageService.fetchMessages();
    setMessages(fetchedMessages);
  };

  const fetchUsername = async () => {
    const username = await authManager.fetchUsername();
    setUsername(username);
  }

  const handleSendMessage = async () => {
    await messageService.sendMessage(username, newMessage);
    setNewMessage('');
    fetchMessages();
  };

  const handleClearMessages = async () => {
    await messageService.deleteMessages();
    fetchMessages();
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
          <div id="messages_div" className="margin">
            {messages.map((msg, index) => (
              <div key={index}>{msg.content}</div> // Customize this as needed
            ))}
          </div>
        </div>
        <div className="center">
          <button type="button" onClick={fetchMessages}>Receive</button>
          <button type="button" onClick={handleClearMessages}>Clear</button>
        </div>
      </div>
      <div>
        <h2 className="center">Send Messages</h2>
        <div className="message_div">
          <div className="Flex-space-between">
            <div className="inFlex-FillSpace" style={{margin: '8px', padding: '8px'}}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message"
              />
            </div>
            <div className="button inFlex-flex-end">
              <button type="button" onClick={handleSendMessage} title="Ctrl + Enter">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageTransmitter;
