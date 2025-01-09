import React, {useEffect, useState} from 'react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {CircularProgress, IconButton, Link, Menu, MenuItem, Tooltip, Typography} from "@mui/material";

import UserLogic from "../../../../src/common/user/UserLogic";
import SignDiv from "./SignDiv";
import CreditDiv from "./CreditDiv";
import useScreenSize from "../../../hooks/useScreenSize";

function AuthDiv() {
  const screenSize = useScreenSize();
  const iconSize = screenSize === 'xs' ? 'small' : screenSize === 'sm' ? 'medium' : 'large';

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  return (
    <div>
      {username ? (
        <div>
          <Tooltip title="Account">
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
              <ManageAccountsIcon fontSize={iconSize} className="text-white"/>
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
            <MenuItem disabled><CreditDiv/></MenuItem>
            <MenuItem component={Link} href="/user/account" onClick={handleMenuClose}>Manage Account</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      ) : (
        <div>
          {loading ? (
            <CircularProgress size={24}/>
          ) : (
            <SignDiv/>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthDiv;