import '../../../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {UserLogic} from "../../../src/logic/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Button, CssBaseline} from "@mui/material";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import HeaderAppBar from "../../../app/components/common/HeaderAppBar";
import {useTheme} from "../../../app/hooks/useTheme";

function Action() {
  const theme = useTheme();

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
      setAlertMessage("Sign up success");
      setAlertOpen(true);
      setAction('signin');
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <HeaderAppBar title={title} useAuthDiv={false}/>
      <div className="flex-center">
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

export default Action;
