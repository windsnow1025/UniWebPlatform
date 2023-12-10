import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThemeSelect from '../component/ThemeSelect';

function UserCenter() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle unauthenticated state if needed
        return;
      }
      try {
        const res = await axios.get('/api/auth/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        // Handle error or redirect to login page
      }
    };

    fetchUsername();
  }, []);

  const isValidInput = (input) => {
    const asciiRegex = /^[\x00-\x7F]{4,32}$/;
    return asciiRegex.test(input);
  };

  const handleUpdate = async () => {
    if (!isValidInput(username) || !isValidInput(password)) {
      alert("Username or Password contains invalid characters or has an invalid length.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/user/`, {
        data: { username, password }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Update Success");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Username already exists.");
      } else {
        alert("Update Fail");
        console.error(err);
      }
    }
  };

  return (
    <div className="Flex-Center">
      <div>
        <h1 className="center">User Center</h1>
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
            <button type="button" onClick={handleUpdate} title="Enter">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCenter;
