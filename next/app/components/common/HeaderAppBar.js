import {AppBar, CircularProgress, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import useScreenSize from "../../hooks/useScreenSize";
import UserLogic from "../../../src/common/user/UserLogic";
import SignDiv from "./settings/auth/signed-out/SignDiv";
import AnnouncementSnackbar from "./AnnouncementSnackbar";

const HeaderAppBar = ({
                        title,
                        useSignDiv = true,
                        infoUrl
                      }) => {
  const screenSize = useScreenSize();
  const iconSize = screenSize === 'xs' ? 'small' : screenSize === 'sm' ? 'medium' : 'large';
  const typographyVariant = screenSize === 'xs' ? 'h6' : screenSize === 'sm' ? 'h5' : 'h4';

  // Sign State
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
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

  // Menu
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Settings
  const handleSettingsClick = () => {
    window.open('/settings', '_blank');
  };

  return (
    <AppBar position="static">
      <div className="flex-around p-2">
        <Tooltip title="Menu">
          <IconButton aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon
              fontSize={iconSize}
              className="text-white"
            />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} href="/" onClick={handleMenuClose}>Home</MenuItem>
          <MenuItem component={Link} href="/markdown" onClick={handleMenuClose}>Markdown Blogs</MenuItem>
          <MenuItem component={Link} href="/bookmark" onClick={handleMenuClose}>Bookmarks</MenuItem>
          <MenuItem component={Link} href="/password" onClick={handleMenuClose}>Password Generator</MenuItem>
          <MenuItem component={Link} href="/image" onClick={handleMenuClose}>Image Generate</MenuItem>
          <MenuItem component={Link} href="/chat" onClick={handleMenuClose}>Windsnow AI Chat</MenuItem>
        </Menu>
        <Typography variant={typographyVariant}>{title}</Typography>
        {infoUrl && (
          <Tooltip title="More Information">
            <IconButton
              component="a"
              href={infoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="information"
            >
              <InfoIcon fontSize={iconSize} className="text-white"/>
            </IconButton>
          </Tooltip>
        )}
        <div className="grow"></div>
        {!username && useSignDiv &&
          <div>
            {loading ? (
              <CircularProgress size={24}/>
            ) : (
              <SignDiv/>
            )}
          </div>
        }
        <Tooltip title="Settings">
          <IconButton onClick={handleSettingsClick}>
            <SettingsIcon fontSize={iconSize} className="text-white"/>
          </IconButton>
        </Tooltip>
      </div>
      <AnnouncementSnackbar/>
    </AppBar>
  );
};

export default HeaderAppBar;