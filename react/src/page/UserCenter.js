import React, { useState, useEffect } from 'react';
import ThemeSelect from '../component/ThemeSelect';
import {UserLogic} from "../logic/UserLogic";

function UserCenter() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userLogic = new UserLogic();

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await userLogic.fetchUsername();
      if (username) {
        setUsername(username);
      }
    };

    fetchUsername();
  });

  const handleUpdate = async () => {
    if (!userLogic.validateInput(username) || !userLogic.validateInput(password)) {
      alert("Username or Password contains invalid characters or has an invalid length.");
      return;
    }

    await userLogic.updateUser(username, password);
  };

  return (
    <div className="Flex-Center">
      <div>
        <h1 className="center">User Center</h1>
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
            <button type="button" onClick={handleUpdate} title="Enter">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCenter;
