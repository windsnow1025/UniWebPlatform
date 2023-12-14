import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

import {UserLogic} from "../logic/UserLogic";

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
          <a href="/user-center"><FontAwesomeIcon icon={faUser}/></a>
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