import React, {useEffect, useState} from 'react';
import {Avatar, Stack, Tooltip, useTheme} from "@mui/material";
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

  const roles = [
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

  return (
    <Stack direction="row" spacing={2}>
      {roles.map(({type, label, tooltip, color, avatar}) => (
        <Tooltip key={type} title={tooltip} arrow>
          <Avatar
            onClick={() => setRole(type)}
            sx={{
              cursor: "pointer",
              width: 30,
              height: 30,
              transition: "border 0.5s ease, background-color 0.5s ease",
              backgroundColor: role === type ? color : theme.vars.palette.text.disabled,
              border: role === type ? "2px solid transparent" : "none",
            }}
            src={avatar}
          >
            {label}
          </Avatar>
        </Tooltip>
      ))}
    </Stack>
  );
}

export default RoleSelect;