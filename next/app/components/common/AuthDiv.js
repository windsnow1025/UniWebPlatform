import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Button, IconButton, CircularProgress } from "@mui/material";
import Link from "next/link";

import { UserLogic } from "../../../src/logic/UserLogic";

function AuthDiv() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userLogic = new UserLogic();

  useEffect(() => {
    const fetchUsername = async () => {
      setLoading(true);
      const username = await userLogic.fetchUsername();
      setUsername(username);
      setLoading(false);
    };

    fetchUsername();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUsername(null);
  };

  const handleSignInRouter = () => {
    localStorage.setItem('prevUrl', pathname);
    router.push('/user/state/signin');
  };

  const handleSignUpRouter = () => {
    localStorage.setItem('prevUrl', pathname);
    router.push('/user/state/signup');
  };

  return (
    <div>
      {username ? (
        <div className="flex-around">
          <span>{username}</span>
          <Link href="/user/account">
            <IconButton aria-label="manage account">
              <ManageAccountsIcon />
            </IconButton>
          </Link>
          <Button variant="contained" onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <div className="flex-around">
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <div className="m-1"><Button variant="contained" onClick={handleSignInRouter}>Sign In</Button></div>
              <div className="m-1"><Button variant="contained" onClick={handleSignUpRouter}>Sign Up</Button></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthDiv;
