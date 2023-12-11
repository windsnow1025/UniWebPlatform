import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { AuthManager } from "../manager/AuthManager";

function AuthDiv() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const authManager = new AuthManager();

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    const username = await authManager.fetchUsername();
    setUsername(username);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUsername(null);
  };

  const handleSignIn = () => {
    localStorage.setItem('prevUrl', location.pathname);
    navigate('/signin');
  };

  const handleSignUp = () => {
    localStorage.setItem('prevUrl', location.pathname);
    navigate('/signup');
  };

  return (
      <div>
        {username ? (
            <div className="Flex-space-around">
              <span>{username}</span>
              <a href="/user-center">
                <FontAwesomeIcon icon={faUser} />
              </a>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
        ) : (
            <div className="Flex-space-around">
              <button onClick={handleSignIn}>Sign in</button>
              <button onClick={handleSignUp}>Sign up</button>
            </div>
        )}
      </div>
  );
}

export default AuthDiv;