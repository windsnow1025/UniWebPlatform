import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Tooltip, useTheme, Menu, MenuItem, ListItemIcon, ListItemText} from "@mui/material";
import BuildIcon from '@mui/icons-material/Build';
import AssistantIcon from '@mui/icons-material/Assistant';
import {MessageRoleEnum} from "../../../client";
import {useSession} from "@toolpad/core";

function RoleSelect({role, setRole}) {
  const theme = useTheme();
  const session = useSession();

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (!session) return;
    setUsername(session.user.name);
    setAvatar(session.user.image);
  }, [session]);

  const rolesConfig = [
    {
      type: MessageRoleEnum.User,
      label: username ? username[0].toUpperCase() : "U",
      tooltip: "User",
      color: `color-mix(in srgb, ${theme.vars.palette.primary.main}, white 50%)`,
      avatar: avatar
    },
    {
      type: MessageRoleEnum.Assistant,
      label: <AssistantIcon/>,
      tooltip: "Assistant",
      color: `color-mix(in srgb, ${theme.vars.palette.secondary.main}, white 50%)`,
      avatar: null
    },
    {
      type: MessageRoleEnum.System,
      label: <BuildIcon/>,
      tooltip: "System",
      color: `color-mix(in srgb, ${theme.vars.palette.warning.main}, white 50%)`,
      avatar: null
    }
  ];

  const currentRoleConfig = rolesConfig.find(
    roleConfig => roleConfig.type === role
  );

  // Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (type) => {
    setRole(type);
    handleClose();
  };

  return (
    <>
      <Tooltip title={currentRoleConfig.tooltip} arrow>
        <Avatar
          onClick={handleOpen}
          sx={{
            cursor: "pointer",
            width: 30,
            height: 30,
            transition: "border 0.5s ease, background-color 0.5s ease",
            backgroundColor: currentRoleConfig.color,
          }}
          src={currentRoleConfig.avatar}
        >
          {currentRoleConfig.label}
        </Avatar>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {rolesConfig
          .filter(roleConfig => roleConfig.type !== role)
          .map(({type, label, tooltip, color, avatar}) => (
            <MenuItem key={type} onClick={() => handleSelect(type)}>
              <ListItemIcon>
                <Avatar sx={{ width: 30, height: 30, backgroundColor: color }} src={avatar}>
                  {label}
                </Avatar>
              </ListItemIcon>
              <ListItemText>{tooltip}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}

export default RoleSelect;