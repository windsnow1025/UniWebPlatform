import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import {UserLogic} from "../logic/UserLogic";
import {IconButton} from "@mui/material";

function AuthDiv() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userLogic = new UserLogic();

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await userLogic.fetchUsername();
      setUsername(username);
    };

    fetchUsername();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUsername(null);
  };

  const handleSignInRouter = () => {
    localStorage.setItem('prevUrl', location.pathname);
    navigate('/signin');
  };

  const handleSignUpRouter = () => {
    localStorage.setItem('prevUrl', location.pathname);
    navigate('/signup');
  };

  return (
    <div>
      {username ? (
        <div className="Flex-space-around">
          <span>{username}</span>
          <Link to="/user-center">
            <IconButton aria-label="Manage Account">
              <ManageAccountsIcon />
            </IconButton>
          </Link>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div className="Flex-space-around">
          <button onClick={handleSignInRouter}>Sign in</button>
          <button onClick={handleSignUpRouter}>Sign up</button>
        </div>
      )}
    </div>
  );
}

export default AuthDiv;