import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import ThemeSelect from '../component/ThemeSelect';
import {UserLogic} from "../logic/UserLogic";
import {ThemeProvider} from "@mui/material/styles";
import {getInitMUITheme} from "../logic/ThemeLogic";

function SignUp() {
  const [theme, setTheme] = useState(getInitMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const userLogic = new UserLogic();

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const handleSignUp = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      alert("Username or Password contains invalid characters or has an invalid length.");
      return;
    }
    if (await userLogic.signUp(username, password)) {
      let prevUrl = localStorage.getItem('prevUrl') || "/";
      navigate(prevUrl);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="Flex-Center">
        <div>
          <h1 className="center">Sign Up</h1>
          <div className="center">
            <ThemeSelect/>
          </div>
          <div className="center">
            <div>
              <input
                className="margin"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div>
              <input
                className="margin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div>
              <button type="button" onClick={handleSignUp} title="Enter">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SignUp;
