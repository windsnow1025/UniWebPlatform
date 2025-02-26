import React, { useEffect, useState } from 'react';
import UserLogic from "../../../../../../src/common/user/UserLogic";
import TextField from "@mui/material/TextField";
import { Alert, Button, Snackbar } from "@mui/material";

function PasswordSection() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const userLogic = new UserLogic();

  useEffect(() => {
    if (confirmNewPassword === '' || newPassword === '') {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(newPassword === confirmNewPassword);
    }
  }, [newPassword, confirmNewPassword]);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleUpdatePassword = async () => {
    if (!userLogic.validateUsernameOrPassword(newPassword)) {
      showAlert("Password invalid. Must be 4-32 ASCII characters.", 'warning');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showAlert("Passwords do not match.", 'warning');
      return;
    }

    try {
      setIsProcessing(true);
      await userLogic.updatePassword(newPassword);
      showAlert("Password updated successfully", 'success');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <TextField
        label="New Password"
        variant="outlined"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={isProcessing}
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        type="password"
        fullWidth
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        error={!passwordsMatch}
        helperText={!passwordsMatch ? "Passwords don't match" : ""}
        disabled={isProcessing}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdatePassword}
        fullWidth
        disabled={!passwordsMatch || isProcessing}
      >
        Update Password
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

export default PasswordSection;