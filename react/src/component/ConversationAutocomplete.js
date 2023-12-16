import { ThemeProvider } from '@mui/material/styles';
import React, {useState, useEffect} from 'react';
import { getInitMUITheme } from "../logic/ThemeLogic";
import CustomAutocomplete from './CustomAutocomplete';
import ConversationService from "../service/ConversationService";

function ConversationAutocomplete({ conversation, onConversationClick }) {
  const [theme, setTheme] = useState(getInitMUITheme());
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
  }, []);

  const conversationService = new ConversationService();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchConversations();

  }, []);

  const fetchConversations = async () => {
    try {
      const conversations = await conversationService.fetchConversations();
      setConversations(conversations);
      setOptions(conversations.map(conversation => ({ title: conversation.name, value: conversation.id })));
    } catch (err) {
      console.error(err);
    }
  }

  const handleOptionClick = async (index) => {
    onConversationClick(conversations[index]);
  }

  const handleDelete = async (index) => {
    try {
      await conversationService.deleteConversation(conversations[index].id);
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (name) => {
    try {
      await conversationService.addConversation(name, JSON.stringify(conversation));
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  }

  const handleUpdate = async (index, name) => {
    try {
      await conversationService.updateConversation(name, JSON.stringify(conversation), conversations[index].id);
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CustomAutocomplete
        options={options}
        label={"Select a conversation"}
        handleOptionClick={handleOptionClick}
        handleDelete={handleDelete}
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
      />
    </ThemeProvider>
  );
}

export default ConversationAutocomplete;