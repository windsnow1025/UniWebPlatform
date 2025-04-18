import React, {useEffect, useState} from 'react';
import UserLogic from "../../../../../lib/common/user/UserLogic";
import TextField from "@mui/material/TextField";
import {Alert, Button, Snackbar} from "@mui/material";

function UsernameSection() {
  const [newUsername, setNewUsername] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const userLogic = new UserLogic();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userLogic.fetchUser();
        if (userData) {
          setNewUsername(userData.username);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleUpdateUsername = async () => {
    if (!userLogic.validateUsernameOrPassword(newUsername)) {
      showAlert("Username invalid. Must be 4-32 ASCII characters.", 'warning');
      return;
    }

    try {
      setIsProcessing(true);
      await userLogic.updateUsername(newUsername);
      showAlert("Username updated successfully", 'success');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <TextField
        label="New Username"
        variant="outlined"
        fullWidth
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        disabled={isProcessing}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateUsername}
        fullWidth
        disabled={isProcessing}
      >
        Update Username
      </Button>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UsernameSection;