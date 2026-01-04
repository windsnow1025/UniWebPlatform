import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import UserLogic from "../../lib/common/user/UserLogic";
import { Alert, Button, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { wait } from "../../components/common/utils/Wait";
import Head from "next/head";

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info'); // 'info', 'success', 'warning', 'error'

  const handleSendResetEmail = async () => {
    if (!userLogic.validateEmail(email)) {
      setAlertMessage("Please enter a valid email address.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    try {
      await userLogic.sendPasswordResetEmail(email);
      setEmailSent(true);
      setAlertMessage("Password reset email sent!");
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleUpdatePassword = async () => {
    if (!userLogic.validateEmail(email)) {
      setAlertMessage("Please enter a valid email address.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (!userLogic.validateUsernameOrPassword(password)) {
      setAlertMessage("New password invalid. Must be 4-32 ASCII characters.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    try {
      await userLogic.updateResetPassword(email, password);
      setAlertMessage("Password successfully updated! Redirecting to sign in...");
      setAlertSeverity('success');
      setAlertOpen(true);

      await wait(1);
      router.push("/auth/signin");
    } catch (err) {
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <div className="local-scroll-container">
      <Head>
        <title>Reset Password - Windsnow1025</title>
      </Head>
      <div className="local-scroll-scrollable flex-center">
        <Paper elevation={3} className="flex-center p-6 max-w-md gap-y-4">
          <Typography variant="h5" align="center" gutterBottom>
            Reset Password
          </Typography>

          {!emailSent ? (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Enter your email to receive a password reset link.
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSendResetEmail}
                size="large"
                fullWidth
              >
                Send Reset Email
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                An email has been sent to <strong>{email}</strong>. Please follow the instructions in the email to set your new password via the link provided.
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                <strong>After setting your new password via the email link</strong>, enter it below to update your account.
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleUpdatePassword}
                size="large"
                fullWidth
                disabled={!password}
              >
                Verify and Update Password
              </Button>
            </>
          )}
        </Paper>
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
    </div>
  );
}

export default PasswordReset;