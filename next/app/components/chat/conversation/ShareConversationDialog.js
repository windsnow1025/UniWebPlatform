import React, {useEffect, useState} from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  TextField,
} from '@mui/material';
import UserLogic from "../../../../lib/common/user/UserLogic";
import ConversationLogic from "../../../../lib/conversation/ConversationLogic";

function ShareConversationDialog({open, onClose, conversationId}) {
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [isLink, setIsLink] = useState(false);

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
      if (isLink) {
        await conversationLogic.addUserToConversation(conversationId, selectedUsername);
        setAlertMessage('Conversation shared (link) successfully');
      } else {
        await conversationLogic.addConversationForUser(conversationId, selectedUsername);
        setAlertMessage('Conversation shared (copy) successfully');
      }
      setAlertSeverity('success');
      setAlertOpen(true);
      setSelectedUsername('');
      onClose();
    } catch (err) {
      setAlertMessage(err.message);
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
          <FormControlLabel
            control={
              <Checkbox
                checked={isLink}
                onChange={(e) => setIsLink(e.target.checked)}
              />
            }
            label="Link"
          />
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