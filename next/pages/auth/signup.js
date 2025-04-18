import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import UserLogic from "../../lib/common/user/UserLogic";
import {Alert, Button, Paper, Snackbar, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {wait} from "../../app/utils/Wait";

function SignUp() {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const router = useRouter();
  const userLogic = new UserLogic();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  useEffect(() => {
    if (confirmPassword === '' || password === '') {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(password === confirmPassword);
    }
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
      await userLogic.signUp(username, email, password);
      setAlertMessage("Sign up success! Redirecting to sign in page...");
      setAlertSeverity('info');
      setAlertOpen(true);

      await wait(1);
      router.push("/auth/signin");
    } catch (error) {
      setAlertMessage(error.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <div className="local-scroll-container">
      <div className="local-scroll-scrollable flex-center">
        <Paper elevation={3} className="flex-center p-6 max-w-md gap-y-4">
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
            error={!passwordsMatch}
            helperText={!passwordsMatch ? "Passwords don't match" : ""}
          />

          <Button
            variant="contained"
            onClick={handleSignUp}
            size="large"
            fullWidth
            disabled={!passwordsMatch}
          >
            Sign Up
          </Button>

          <Typography variant="body2" sx={{mt: 2}}>
            Already have an account?{' '}
            <Button
              onClick={() => router.push("/auth/signin")}
              sx={{p: 0, minWidth: 'auto'}}
            >
              Sign In
            </Button>
          </Typography>
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

export default SignUp;