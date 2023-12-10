import React, { useState } from 'react';
import axios from 'axios';
import ThemeSelect from '../component/ThemeSelect';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isValidInput = (input) => {
    // Check if input contains only ASCII characters and has a length between 6 and 20
    const asciiRegex = /^[\x00-\x7F]{4,32}$/;
    return asciiRegex.test(input);
  };

  const handleSignUp = async () => {
    if (!isValidInput(username) || !isValidInput(password)) {
      alert("Username or Password contains invalid characters or has an invalid length.");
      return;
    }
    try {
      await axios.post("/api/user/sign-up", {
        data: { username, password }
      });
      alert("Sign Up Success");
      let prevUrl = localStorage.getItem('prevUrl') || "/";
      window.location.href = prevUrl;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Username already exists.");
      } else {
        alert("Sign Up Fail");
        console.error(err);
      }
    }
  };

  return (
    <div className="Flex-Center">
      <div>
        <h1 className="center">Sign Up</h1>
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
            <button type="button" onClick={handleSignUp} title="Enter">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
