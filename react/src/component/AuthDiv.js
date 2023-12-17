import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import {UserLogic} from "../logic/UserLogic";
import {Button, IconButton} from "@mui/material";

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
            <IconButton aria-label="manage account">
              <ManageAccountsIcon />
            </IconButton>
          </Link>
          <Button variant="outlined" onClick={handleSignOut} style={{margin: 4}}>Sign Out</Button>
        </div>
      ) : (
        <div className="Flex-space-around">
          <Button variant="outlined" onClick={handleSignInRouter} style={{margin: 4}}>Sign In</Button>
          <Button variant="outlined" onClick={handleSignUpRouter} style={{margin: 4}}>Sign Up</Button>
        </div>
      )}
    </div>
  );
}

export default AuthDiv;