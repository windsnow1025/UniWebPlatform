import '../src/asset/css/App.css';

import React, {useState, useEffect} from 'react';
import ThemeSelect from '../components/ThemeSelect';
import {UserLogic} from "../src/logic/UserLogic";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {ThemeProvider} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {AppBar, Button} from "@mui/material";

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

    const fetchUsername = async () => {
      const username = await userLogic.fetchUsername();
      if (username) {
        setUsername(username);
      }
    };

    fetchUsername();
  }, []);

  const handleUpdate = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      alert("Username or Password contains invalid characters or has an invalid length.");
      return;
    }

    await userLogic.updateUser(username, password);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <h1 className="center">User Center</h1>
      </AppBar>
      <div className="Flex-space-around">
        <ThemeSelect/>
      </div>
      <div className="Flex-Center">
        <div className="center">
          <div>
            <TextField
              label="Username"
              variant="outlined"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{margin: 8}}
            />
          </div>
          <div>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{margin: 8}}
            />
          </div>
          <div>
            <Button variant="outlined" onClick={handleUpdate}>Update</Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default UserCenter;
