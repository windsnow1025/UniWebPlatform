import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {
  Alert,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function SignUp() {
  const {muiTheme} = useThemeHandler();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Email verification states
  const [verificationCode, setVerificationCode] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (email, code) => {
    setAlertMessage(`For demo purposes: Your verification code is ${code}`);
    setAlertSeverity('info');
    setAlertOpen(true);
    return true;
  };

  const handleInitiateSignUp = async () => {
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

    const code = generateVerificationCode();
    setVerificationCode(code);

    try {
      setIsVerifying(true);
      const emailSent = await sendVerificationEmail(email, code);

      if (emailSent) {
        setVerificationDialogOpen(true);
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (e) {
      setAlertMessage(e.message);
      setAlertSeverity('error');
      setAlertOpen(true);
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    if (userEnteredCode === verificationCode) {
      try {
        await userLogic.signUp(username, email, password);
        setVerificationDialogOpen(false);
        setIsVerifying(false);
        setAlertMessage("Sign up successful! Please sign in.");
        setAlertSeverity('success');
        setAlertOpen(true);
        setTimeout(() => {
          router.push("/user/state/signin");
        }, 2000);
      } catch (e) {
        setAlertMessage(e.message);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } else {
      setAlertMessage("Incorrect verification code. Please try again.");
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleResendCode = () => {
    const code = generateVerificationCode();
    setVerificationCode(code);
    sendVerificationEmail(email, code);
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

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isVerifying}
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isVerifying}
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isVerifying}
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
              disabled={isVerifying}
            />

            <Button
              variant="contained"
              onClick={handleInitiateSignUp}
              size="large"
              fullWidth
              disabled={!passwordsMatch || isVerifying}
            >
              {isVerifying ? "Verifying Email..." : "Sign Up"}
            </Button>

            <Typography variant="body2" sx={{mt: 2}}>
              Already have an account?{' '}
              <Button
                color="primary"
                onClick={() => router.push("/user/state/signin")}
                sx={{p: 0, minWidth: 'auto'}}
                disabled={isVerifying}
              >
                Sign In
              </Button>
            </Typography>
          </Paper>
        </div>
      </div>

      {/* Email Verification Dialog */}
      <Dialog
        open={verificationDialogOpen}
        onClose={() => {
          setVerificationDialogOpen(false);
          setIsVerifying(false);
        }}
      >
        <DialogTitle>Verify Your Email</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Verification code to {email}.
          </Typography>
          <TextField
            label="Verification Code"
            variant="outlined"
            fullWidth
            type="text"
            value={userEnteredCode}
            onChange={(e) => setUserEnteredCode(e.target.value)}
            margin="normal"
            inputProps={{maxLength: 6}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResendCode} color="primary">
            Resend Code
          </Button>
          <Button onClick={handleVerifyCode} color="primary" variant="contained">
            Verify
          </Button>
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
    </ThemeProvider>
  );
}

export default SignUp;