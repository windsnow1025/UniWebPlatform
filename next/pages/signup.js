import '../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import ThemeSelect from '../app/components/ThemeSelect';
import {UserLogic} from "../src/logic/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {AppBar, Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';


function SignUp() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userLogic = new UserLogic();

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignUp = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      setAlertMessage("Username or Password contains invalid characters or has an invalid length.");
      setAlertOpen(true);
      return;
    }
    if (await userLogic.signUp(username, password)) {
      const prevUrl = localStorage.getItem('prevUrl') || "/";
      router.push(prevUrl);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <div className="Flex-space-around p-2">
          <h1 className="grow">Sign Up</h1>
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
            <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>
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

export default SignUp;
