import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {
  Alert,
  Button,
  CssBaseline,
  Paper,
  Snackbar,
  Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";
import {wait} from "../../../app/utils/Wait";

function SignUp() {
  const {muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSignUp = async () => {
    if (!userLogic.validateUsernameOrPassword(username)) {
      setAlertMessage("Username invalid. Must be 4-32 ASCII characters.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (!userLogic.validateEmail(email)) {
      setAlertMessage("Please enter a valid email address.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (!userLogic.validateUsernameOrPassword(password)) {
      setAlertMessage("Password invalid. Must be 4-32 ASCII characters.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    try {
      setIsSendingVerification(true);

      await userLogic.signUp(username, email, password);

      setEmailSent(true);

      setAlertMessage("Verification email sent! Please check your inbox and verify your email to complete registration.");
      setAlertSeverity('info');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage("Error during sign up: " + error.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setAlertMessage("Verification email resent. Please check your inbox.");
      setAlertSeverity('info');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage("Error sending verification email: " + error.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsSendingVerification(true);

      await userLogic.updateEmailVerification(username, email, password);

      setIsSendingVerification(false);
      setEmailSent(false);

      setAlertMessage("Sign up successful! Redirecting to sign in page...");
      setAlertSeverity('success');
      setAlertOpen(true);

      await wait(1);
      router.push("/user/state/signin");
    } catch (error) {
      setIsSendingVerification(false);
      setAlertMessage("Error checking verification: " + error.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar title="Sign Up" useSignDiv={false}/>
        <div className="local-scroll-scrollable flex-center">
          <Paper elevation={3} className="flex-center p-6 max-w-md space-y-4">
            <Typography variant="h5" align="center" gutterBottom>
              Create an Account
            </Typography>

            {emailSent ? (
              <>
                <Typography variant="body1" align="center" gutterBottom>
                  Verification email sent to {email}
                </Typography>
                <Typography variant="body2" align="center" gutterBottom>
                  Please check your inbox and verify your email to complete registration.
                </Typography>
                <Typography variant="body2" align="center" gutterBottom>
                  After clicking the verification link in your email, click the button below.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleCheckVerification}
                  size="medium"
                  fullWidth
                  disabled={isSendingVerification}
                >
                  {isSendingVerification ? "Checking..." : "I've Verified My Email"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResendVerification}
                  size="medium"
                  fullWidth
                  disabled={isSendingVerification}
                >
                  Resend Verification Email
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isSendingVerification}
                />

                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSendingVerification}
                />

                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSendingVerification}
                />

                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  error={!passwordsMatch}
                  helperText={!passwordsMatch ? "Passwords don't match" : ""}
                  disabled={isSendingVerification}
                />

                <Button
                  variant="contained"
                  onClick={handleSignUp}
                  size="large"
                  fullWidth
                  disabled={!passwordsMatch || isSendingVerification}
                >
                  {isSendingVerification ? "Processing..." : "Sign Up"}
                </Button>

                <Typography variant="body2" sx={{mt: 2}}>
                  Already have an account?{' '}
                  <Button
                    color="primary"
                    onClick={() => router.push("/user/state/signin")}
                    sx={{p: 0, minWidth: 'auto'}}
                    disabled={isSendingVerification}
                  >
                    Sign In
                  </Button>
                </Typography>
              </>
            )}
          </Paper>
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
    </ThemeProvider>
  );
}

export default SignUp;