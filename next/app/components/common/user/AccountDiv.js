import React, { useEffect, useState } from 'react';
import UserLogic from "../../../../src/common/user/UserLogic";
import TextField from "@mui/material/TextField";
import { Alert, Button, Divider, Paper, Snackbar, Typography } from "@mui/material";
import CreditDiv from "./CreditDiv";

function AccountDiv() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userLogic.fetchUser();
        if (userData) {
          setUsername(userData.username);
          setEmail(userData.email);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Check if passwords match whenever either password field changes
  useEffect(() => {
    if (confirmPassword === '' || password === '') {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleUpdateUsername = async () => {
    if (!userLogic.validateUsernameOrPassword(username)) {
      showAlert("Username invalid. Must be 4-32 ASCII characters.", 'warning');
      return;
    }

    try {
      await userLogic.updateUsername(username);
      showAlert("Username updated successfully", 'success');
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  const handleUpdateEmail = async () => {
    if (!userLogic.validateEmail(email)) {
      showAlert("Please enter a valid email address.", 'warning');
      return;
    }

    try {
      await userLogic.updateEmail(email);
      showAlert("Email updated successfully", 'success');
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  const handleUpdatePassword = async () => {
    if (!userLogic.validateUsernameOrPassword(password)) {
      showAlert("Password invalid. Must be 4-32 ASCII characters.", 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match.", 'warning');
      return;
    }

    try {
      await userLogic.updatePassword(password);
      showAlert("Password updated successfully", 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      showAlert(e.message, 'error');
    }
  };

  return (
    <Paper elevation={3} className="p-4 max-w-md mx-auto">
      <Typography variant="h5" className="mb-4 text-center" gutterBottom>
        Account Settings
      </Typography>

      <div className="flex-center m-2">
        <CreditDiv/>
      </div>


      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateUsername}
            fullWidth
          >
            Update Username
          </Button>
        </div>
      </div>

      <Divider className="my-4" />

      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateEmail}
            fullWidth
          >
            Update Email
          </Button>
        </div>
      </div>

      <Divider className="my-4" />

      <div className="mb-2">
        <div className="flex flex-col gap-2">
          <TextField
            label="New Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!passwordsMatch}
            helperText={!passwordsMatch ? "Passwords don't match" : ""}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdatePassword}
            fullWidth
            disabled={!passwordsMatch}
          >
            Update Password
          </Button>
        </div>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AccountDiv;