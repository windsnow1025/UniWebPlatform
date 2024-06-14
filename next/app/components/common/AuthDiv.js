import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Button, IconButton, CircularProgress, Link, Menu, MenuItem, Typography, Tooltip } from "@mui/material";

import { UserLogic } from "../../../src/logic/UserLogic";

function AuthDiv() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUsername("");
    handleMenuClose();
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
        <div>
          <Tooltip title="Account">
            <IconButton
              aria-label="account"
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <ManageAccountsIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="subtitle1">{username}</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/account" onClick={handleMenuClose}>Manage Account</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      ) : (
        <div className="flex-around">
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <div className="m-1">
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleSignInRouter}
                >
                  Sign In
                </Button>
              </div>
              <div className="m-1">
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleSignUpRouter}
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthDiv;