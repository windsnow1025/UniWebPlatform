import React, { useState, useEffect, useRef } from 'react';
import { MessageService } from "../service/MessageService";
import { AuthManager } from "../manager/AuthManager";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';

function MessageTransmitter() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const messageService = new MessageService();
  const authManager = new AuthManager();
  const messageInputRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchUsername();
  }, []);

  const fetchMessages = async () => {
    const fetchedMessages = await messageService.fetchMessages();
    setMessages(fetchedMessages);
  };

  const fetchUsername = async () => {
    const fetchedUsername = await authManager.fetchUsername();
    setUsername(fetchedUsername);
  };

  const handleSendMessage = async () => {
    if (messageInputRef.current) {
      const message = messageInputRef.current.textContent;
      await messageService.sendMessage(username, message);
      messageInputRef.current.textContent = '';
      fetchMessages();
    }
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
          <div className="margin">
            {messages.map((msg, index) => (
              <div key={index} className="message_div">{msg.content}</div>
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
            <div
              ref={messageInputRef}
              className="inFlex-FillSpace markdown-body"
              style={{ margin: '8px', padding: '8px', minHeight: '24px' }}
              contentEditable="plaintext-only"
            ></div>
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
