import React, {useEffect, useState} from 'react';
import CRUDAutocomplete from '../common/CRUDAutocomplete';
import ConversationService from "../../../src/service/ConversationService";
import Snackbar from "@mui/material/Snackbar";

function ChatConversationAutocomplete({conversation, onConversationClick}) {
  const [conversations, setConversations] = useState([]);

  const conversationService = new ConversationService();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchConversations = async () => {
    try {
      const conversations = await conversationService.fetchConversations();
      setConversations(conversations);
      setOptions(conversations.map(conversation => ({title: conversation.name, value: conversation.id})));
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error fetching conversations');
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
      setAlertOpen(true);
      setAlertMessage('Conversation deleted');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error deleting conversation');
      console.error(err);
    }
  };

  const handleAdd = async (name) => {
    try {
      await conversationService.addConversation(name, JSON.stringify(conversation));
      fetchConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation added');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error adding conversation');
      console.error(err);
    }
  }

  const handleUpdate = async (index, name) => {
    try {
      await conversationService.updateConversation(name, JSON.stringify(conversation), conversations[index].id);
      fetchConversations();
      setAlertOpen(true);
      setAlertMessage('Conversation updated');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage('Error updating conversation');
      console.error(err);
    }
  }

  return (
    <>
      <CRUDAutocomplete
        options={options}
        label={"Select a conversation"}
        onOptionClick={handleOptionClick}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
      />
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </>
  );
}

export default ChatConversationAutocomplete;