import React, { useEffect, useState } from 'react';
import UserLogic from "../../../../../../src/common/user/UserLogic";
import TextField from "@mui/material/TextField";
import { Alert, Button, Snackbar, Typography } from "@mui/material";

function EmailSection() {
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailVerificationPassword, setEmailVerificationPassword] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const userLogic = new UserLogic();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userLogic.fetchUser();
        if (user) {
          setEmail(user.email);
          setEmailVerified(user.emailVerified);
          setNewEmail(user.email);
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

  const handleUpdateEmail = async () => {
    if (!userLogic.validateEmail(newEmail)) {
      showAlert("Please enter a valid email address.", 'warning');
      return;
    }

    try {
      setIsProcessing(true);

      await userLogic.updateEmail(newEmail);
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
      const userData = await userLogic.fetchUser();
      await userLogic.updateEmailVerification(userData.username, newEmail, emailVerificationPassword);
      setEmailVerificationSent(false);
      showAlert("Email updated and verified successfully!", 'success');
    } catch (e) {
      showAlert(e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {emailVerificationSent ? (
        <>
          <Typography variant="body1" align="center" gutterBottom>
            Verification email sent to {newEmail}
          </Typography>
          <Typography variant="body2" align="center" gutterBottom>
            Please check your inbox and verify your email to complete the update.
          </Typography>
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
        </>
      ) : (
        <>
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
            label="Password"
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
            disabled={isProcessing || (email === newEmail && emailVerified)}
          >
            {emailVerified ? "Update Email" : "Verify Email"}
          </Button>
        </>
      )}

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

export default EmailSection;