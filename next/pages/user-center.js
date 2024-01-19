import '../src/asset/css/index.css';

import React, {useState, useEffect} from 'react';
import ThemeSelect from '../app/components/ThemeSelect';
import {UserLogic} from "../src/logic/UserLogic";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {AppBar, Button, Toolbar} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

function UserCenter() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userLogic = new UserLogic();

  useEffect(() => {
    document.title = "User Center";
  }, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleUpdate = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      setAlertMessage("Username or Password contains invalid characters or has an invalid length.");
      setAlertOpen(true);
      return;
    }

    try {
      await userLogic.updateUser(username, password);
      setAlertMessage("Update success.");
      setAlertOpen(true);
    } catch (e) {
      setAlertMessage(e.message);
      setAlertOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <div className="Flex-space-around p-2">
          <h1 className="grow">User Center</h1>
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
            <Button variant="contained" onClick={handleUpdate}>Update</Button>
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

export default UserCenter;
