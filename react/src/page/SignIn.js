import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {UserLogic} from "../logic/UserLogic";

import ThemeSelect from '../component/ThemeSelect';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const userLogic = new UserLogic();

  const handleSignIn = async () => {
      if (await userLogic.signIn(username, password)) {
        let prevUrl = localStorage.getItem('prevUrl') || "/";
        navigate(prevUrl);
      }
  };

  return (
    <div className="Flex-Center">
      <div>
        <h1 className="center">Sign In</h1>
        <div className="center">
          <ThemeSelect />
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
            <button type="button" onClick={handleSignIn} title="Enter">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
