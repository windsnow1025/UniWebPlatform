import React, { useState } from 'react';
import axios from 'axios';

import ThemeSelect from '../component/ThemeSelect';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const res = await axios.post("/api/user/sign-in", {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      let prevUrl = localStorage.getItem('prevUrl') || "/";
      window.location.href = prevUrl;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Invalid Username or Password");
      } else {
        alert("Sign In Fail");
        console.error(err);
      }
    }
  };

  return (
    <div className="Flex-Center">
      <div>
        <h1 className="center">Sign In</h1>
        <div id="theme" className="center">
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
