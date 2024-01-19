import '../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {UserLogic} from "../src/logic/UserLogic";

import ThemeSelect from '../app/components/ThemeSelect';
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {ThemeProvider} from "@mui/material/styles";
import {AppBar, Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";

function UserSign() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const [action, setAction] = useState('');
  const [title, setTitle] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const userLogic = new UserLogic();

  useEffect(() => {
    setAction(router.query.action);
  }, [router.query.action]);

  useEffect(() => {
    if (action === 'signin') {
      setTitle("Sign In");
    }
    if (action === 'signup') {
      setTitle("Sign Up");
    }
  }, [action]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignIn = async () => {
    try {
      await userLogic.signIn(username, password)
      const prevUrl = localStorage.getItem('prevUrl') || "/";
      router.push(prevUrl);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  const handleSignUp = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      setAlertMessage("Username or Password contains invalid characters or has an invalid length.");
      setAlertOpen(true);
      return;
    }
    try {
      await userLogic.signUp(username, password);
      setAlertMessage("Sign up successful.");
      setAlertOpen(true);
      setAction('signin');
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <div className="Flex-space-around p-2">
          <h1 className="grow">{title}</h1>
          <div className="m-1"><ThemeSelect/></div>
        </div>
      </AppBar>
      <div className="Flex-Center">
        <div className="text-center">
          <div className="m-2">
            <TextField
              label="Username"
              variant="outlined"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="m-2">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="m-2">
            <Button variant="contained" onClick={action === 'signin' ? handleSignIn : handleSignUp}>{title}</Button>
          </div>
        </div>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </ThemeProvider>
  );
}

export default UserSign;