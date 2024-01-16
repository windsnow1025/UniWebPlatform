import React, {useState, useEffect} from 'react';
import CustomAutocomplete from './CustomAutocomplete';
import ConversationService from "../src/service/ConversationService";

function ConversationAutocomplete({conversation, onConversationClick}) {
  const [conversations, setConversations] = useState([]);

  const conversationService = new ConversationService();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchConversations();

  }, []);

  const fetchConversations = async () => {
    try {
      const conversations = await conversationService.fetchConversations();
      setConversations(conversations);
      setOptions(conversations.map(conversation => ({title: conversation.name, value: conversation.id})));
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
    <CustomAutocomplete
      options={options}
      label={"Select a conversation"}
      handleOptionClick={handleOptionClick}
      handleDelete={handleDelete}
      handleAdd={handleAdd}
      handleUpdate={handleUpdate}
    />
  );
}

export default ConversationAutocomplete;