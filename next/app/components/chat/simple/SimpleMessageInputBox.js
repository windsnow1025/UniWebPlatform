import {Alert, Box, IconButton, InputAdornment, Paper, Snackbar, TextField} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, {useState} from "react";
import ChatLogic from "../../../../src/conversation/chat/ChatLogic";
import ConversationLogic from "../../../../src/conversation/ConversationLogic";

function SimpleMessageInputBox({ messages, setMessages, setConversations, currentConversationId }) {
  const chatLogic = new ChatLogic();

  // Chat Parameters
  const apiType = chatLogic.defaultApiType;
  const model = chatLogic.defaultModel;
  const temperature = 0;
  const stream = true;

  const [newContent, setNewContent] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleSend = async () => {
    if (!localStorage.getItem('token')) {
      alert('Please sign in first.');
      return;
    }

    let updatedMessages = [...messages];

    const newMessage = chatLogic.createUserMessage(newContent);
    updatedMessages = [...updatedMessages, newMessage];
    setMessages(updatedMessages);
    setNewContent('');

    const scrollableContainer = document.querySelector('.local-scroll-scrollable');

    if (!stream) {
      const content = await chatLogic.nonStreamGenerate(updatedMessages, apiType, model, temperature, stream);
      updatedMessages = [...updatedMessages, chatLogic.createAssistantMessage(content), chatLogic.emptyUserMessage];
      setMessages(updatedMessages);
    } else {
      let isFirstChunk = true;
      for await (const chunk of chatLogic.streamGenerate(updatedMessages, apiType, model, temperature, stream)) {
        if (isFirstChunk) {
          updatedMessages = [...updatedMessages, chatLogic.emptyAssistantMessage];
          setMessages(updatedMessages);
          isFirstChunk = false;
        }
        updatedMessages[updatedMessages.length - 1].text += chunk;
        setMessages([...updatedMessages]);
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }
    }
    scrollableContainer.scrollTop = scrollableContainer.scrollHeight;

    updateConversation(updatedMessages);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const conversationLogic = new ConversationLogic();

  const updateConversation = async (updatedMessages) => {
    try {
      const conversations = await conversationLogic.fetchConversations();
      const conversation = conversations.find(convo => convo.id === currentConversationId);
      // For temporary chat
      if (conversation === undefined) {
        return;
      }
      await conversationLogic.updateConversation({
        id: currentConversationId,
        name: conversation.name,
        messages: JSON.stringify(updatedMessages)
      });
      setConversations(await conversationLogic.fetchConversations());
      setAlertOpen(true);
      setAlertMessage('Conversation updated');
      setAlertSeverity('success');
    } catch (err) {
      setAlertOpen(true);
      setAlertMessage(`Error updating conversation: ${err}`);
      setAlertSeverity('error');
      console.error(err);
    }
  };

  return (
    <>
      <Box component={Paper} elevation={2} className="flex items-center p-2 m-2">
        <TextField
          placeholder="Type a message"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 m-1"
          multiline
          minRows={1}
          maxRows={10}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSend} color="primary">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default SimpleMessageInputBox;