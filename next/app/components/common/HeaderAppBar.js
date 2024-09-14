import {AppBar, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import AuthDiv from "./user/AuthDiv";
import ThemeToggle from "./ThemeToggle";
import React, {useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';
import useScreenSize from "../../hooks/useScreenSize";

const HeaderAppBar = ({
                        title,
                        useAuthDiv = true,
                        systemTheme,
                        setSystemTheme,
                        refreshKey,
                        infoUrl
                      }) => {
  const screenSize = useScreenSize();
  const iconSize = screenSize === 'xs' ? 'small' : screenSize === 'sm' ? 'medium' : 'large';
  const typographyVariant = screenSize === 'xs' ? 'h6' : screenSize === 'sm' ? 'h5' : 'h4';

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
          <MenuItem component={Link} href="/message" onClick={handleMenuClose}>Message Transmitter</MenuItem>
          <MenuItem component={Link} href="/password" onClick={handleMenuClose}>Password Generator</MenuItem>
          <MenuItem component={Link} href="/image" onClick={handleMenuClose}>Image Generate</MenuItem>
          <MenuItem component={Link} href="/chat/advanced" onClick={handleMenuClose}>Advanced AI Chat</MenuItem>
          <MenuItem component={Link} href="/chat/simple" onClick={handleMenuClose}>Simple AI Chat</MenuItem>
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
              <InfoIcon fontSize={iconSize} className="text-white" />
            </IconButton>
          </Tooltip>
        )}
        <div className="grow"></div>
        {useAuthDiv &&
          <div className="m-1 mx-2">
            <AuthDiv refreshKey={refreshKey} />
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