import { AppBar, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import AuthDiv from "./AuthDiv";
import ThemeToggle from "./ThemeToggle";
import React, { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const HeaderAppBar = ({ title, useAuthDiv = true, systemTheme, setSystemTheme }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <div className="flex-around p-2">
        <IconButton aria-label="menu" onClick={handleMenuOpen}>
          <MenuIcon
            fontSize="large"
            className="text-white"
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} href="/markdown" onClick={handleMenuClose}>Markdown Blogs</MenuItem>
          <MenuItem component={Link} href="/bookmark" onClick={handleMenuClose}>Bookmarks</MenuItem>
          <MenuItem component={Link} href="/message" onClick={handleMenuClose}>Message Transmitter</MenuItem>
          <MenuItem component={Link} href="/password" onClick={handleMenuClose}>Password Generator</MenuItem>
          <MenuItem component={Link} href="/image" onClick={handleMenuClose}>Image Generate</MenuItem>
          <MenuItem component={Link} href="/chat" onClick={handleMenuClose}>AI Chat</MenuItem>
        </Menu>
        <Typography variant="h4" className="grow">
          {title}
        </Typography>
        {useAuthDiv &&
          <div className="m-1 mx-2">
            <AuthDiv />
          </div>
        }
        <div className="m-1 mx-2">
          <ThemeToggle
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
        </div>
      </div>
    </AppBar>
  );
};

export default HeaderAppBar;