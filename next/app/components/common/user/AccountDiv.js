import React, { useEffect, useState } from 'react';
import UserLogic from "../../../../src/common/user/UserLogic";
import TextField from "@mui/material/TextField";
import { Alert, Button, Divider, Paper, Snackbar, Typography } from "@mui/material";
import CreditDiv from "./CreditDiv";

function AccountDiv() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerificationPassword, setEmailVerificationPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
          setNewEmail(userData.email);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
      setIsProcessing(true);
      await userLogic.updateUsername(username);
      showAlert("Username updated successfully", 'success');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!userLogic.validateEmail(newEmail)) {
      showAlert("Please enter a valid email address.", 'warning');
      return;
    }

    if (newEmail === email) {
      showAlert("New email is the same as current email.", 'warning');
      return;
    }

    try {
      setIsProcessing(true);
      // First, update the email in the system
      await userLogic.updateEmail(newEmail);

      // Then send verification email
      await userLogic.sendEmailVerification(newEmail, emailVerificationPassword);

      setEmailVerificationSent(true);
      showAlert("Verification email sent to " + newEmail + ". Please verify your email to complete the update.", 'info');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsProcessing(true);
      await userLogic.sendEmailVerification(newEmail, emailVerificationPassword);
      showAlert("Verification email resent. Please check your inbox.", 'info');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsProcessing(true);
      await userLogic.updateEmailVerification(username, newEmail, emailVerificationPassword);
      setEmailVerificationSent(false);
      setEmail(newEmail);
      showAlert("Email updated and verified successfully!", 'success');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEmailUpdate = () => {
    setEmailVerificationSent(false);
    setNewEmail(email);
    setEmailVerificationPassword('');
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
      setIsProcessing(true);
      await userLogic.updatePassword(password);
      showAlert("Password updated successfully", 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
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
        </div>
      </div>

      <Divider className="my-4" />

      <div className="mb-6">
        <div className="flex flex-col gap-2">
          {emailVerificationSent ? (
            <>
              <Typography variant="body1" align="center" gutterBottom>
                Verification email sent to {newEmail}
              </Typography>
              <Typography variant="body2" align="center" gutterBottom>
                Please check your inbox and verify your email to complete the update.
              </Typography>
              <TextField
                label="Password (for verification)"
                variant="outlined"
                type="password"
                fullWidth
                value={emailVerificationPassword}
                onChange={(e) => setEmailVerificationPassword(e.target.value)}
                disabled={isProcessing}
              />
              <Button
                variant="contained"
                onClick={handleCheckVerification}
                size="medium"
                fullWidth
                disabled={isProcessing || !emailVerificationPassword}
              >
                {isProcessing ? "Checking..." : "I've Verified My Email"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleResendVerification}
                size="medium"
                fullWidth
                disabled={isProcessing || !emailVerificationPassword}
              >
                Resend Verification Email
              </Button>
              <Button
                variant="text"
                onClick={handleCancelEmailUpdate}
                size="medium"
                fullWidth
                disabled={isProcessing}
              >
                Cancel Email Update
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Current Email"
                variant="outlined"
                type="email"
                fullWidth
                value={email}
                disabled={true}
              />
              <TextField
                label="New Email"
                variant="outlined"
                type="email"
                fullWidth
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isProcessing}
              />
              <TextField
                label="Password (for verification)"
                variant="outlined"
                type="password"
                fullWidth
                value={emailVerificationPassword}
                onChange={(e) => setEmailVerificationPassword(e.target.value)}
                disabled={isProcessing}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateEmail}
                fullWidth
                disabled={isProcessing || !emailVerificationPassword || newEmail === email}
              >
                {isProcessing ? "Processing..." : "Update Email"}
              </Button>
            </>
          )}
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
            disabled={isProcessing}
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
        </div>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AccountDiv;