import React, {useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../../src/common/user/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Alert, Button, CssBaseline, Snackbar, Box, Typography, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../../app/hooks/useThemeHandler";

function SignUp() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

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
      await userLogic.signUp(username, email, password);
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
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              variant="contained"
              onClick={handleSignUp}
              size="large"
              fullWidth
            >
              Sign Up
            </Button>

            <Typography variant="body2" sx={{mt: 2}}>
              Already have an account?{' '}
              <Button
                color="primary"
                onClick={() => router.push("/user/state/signin")}
                sx={{p: 0, minWidth: 'auto'}}
              >
                Sign In
              </Button>
            </Typography>
          </Paper>
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default SignUp;