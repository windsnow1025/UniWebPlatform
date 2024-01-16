import React, {useEffect, useState} from 'react';
import {useRouter, usePathname} from "next/navigation";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {Button, IconButton} from "@mui/material";
import Link from "next/link";

import {UserLogic} from "../../src/logic/UserLogic";

function AuthDiv() {
  const [username, setUsername] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
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
    localStorage.setItem('prevUrl', pathname);
    router.push('/signin');
  };

  const handleSignUpRouter = () => {
    localStorage.setItem('prevUrl', pathname);
    router.push('/signup');
  };

  return (
    <div>
      {username ? (
        <div className="Flex-space-around">
          <span>{username}</span>
          <Link href="/user-center">
            <IconButton aria-label="manage account">
              <ManageAccountsIcon />
            </IconButton>
          </Link>
          <Button variant="contained" onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <div className="Flex-space-around">
          <div className="m-1"><Button variant="contained" onClick={handleSignInRouter}>Sign In</Button></div>
          <div className="m-1"><Button variant="contained" onClick={handleSignUpRouter} className="m-1">Sign Up</Button></div>
        </div>
      )}
    </div>
  );
}

export default AuthDiv;