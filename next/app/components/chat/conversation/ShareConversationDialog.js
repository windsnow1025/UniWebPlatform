import React, {useEffect, useState} from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Alert,
} from '@mui/material';
import UserLogic from "../../../../src/common/user/UserLogic";
import ConversationLogic from "../../../../src/conversation/ConversationLogic";

function ShareConversationDialog({open, onClose, conversationId}) {
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const userLogic = new UserLogic();
  const conversationLogic = new ConversationLogic();

  useEffect(() => {
    if (open) {
      fetchUsernames();
    }
  }, [open]);

  const fetchUsernames = async () => {
    try {
      setUsernames(await userLogic.fetchUsernames());
    } catch (err) {
      console.error('Error fetching usernames', err);
    }
  };

  const handleShare = async () => {
    try {
      await conversationLogic.addUserToConversation(conversationId, selectedUsername);
      setAlertMessage('Conversation shared successfully');
      setAlertSeverity('success');
      setAlertOpen(true);
      setSelectedUsername('');
      onClose();
    } catch (err) {
      setAlertMessage('Error sharing conversation');
      setAlertSeverity('error');
      setAlertOpen(true);
      console.error(err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Share Conversation</DialogTitle>
        <DialogContent>
          <div className="m-2">
            <Autocomplete
              options={usernames}
              getOptionLabel={(option) => option}
              value={selectedUsername}
              onChange={(event, newValue) => setSelectedUsername(newValue)}
              renderInput={(params) => <TextField {...params} label="Username"/>}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleShare}>Share</Button>
        </DialogActions>
      </Dialog>
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
  );
}

export default ShareConversationDialog;