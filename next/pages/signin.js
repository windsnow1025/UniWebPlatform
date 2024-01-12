import '../src/asset/css/App.css';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {UserLogic} from "../src/logic/UserLogic";

import ThemeSelect from '../src/component/ThemeSelect';
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {ThemeProvider} from "@mui/material/styles";
import {Button} from "@mui/material";
import TextField from "@mui/material/TextField";

function SignIn() {
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
  const router = useRouter();
  const userLogic = new UserLogic();

  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const handleSignIn = async () => {
      if (await userLogic.signIn(username, password)) {
        let prevUrl = localStorage.getItem('prevUrl') || "/";
        router.push(prevUrl);
      }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="Flex-Center">
        <div>
          <h1 className="center">Sign In</h1>
          <div className="center">
            <ThemeSelect />
          </div>
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
              <Button variant="outlined" onClick={handleSignIn}>Sign In</Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SignIn;
