import React, {useEffect, useState} from 'react';
import {Avatar, lighten, Stack, Tooltip, useTheme} from "@mui/material";
import UserLogic from "../../../lib/common/user/UserLogic";
import BuildIcon from '@mui/icons-material/Build';
import AssistantIcon from '@mui/icons-material/Assistant';
import {MessageRoleEnum} from "../../../client";

function RoleSelect({role, setRole}) {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      const userLogic = new UserLogic();
      const fetchedUsername = await userLogic.fetchUsername();
      const fetchedAvatar = await userLogic.fetchAvatar();

      if (fetchedUsername) {
        setUsername(fetchedUsername);
      }
      if (fetchedAvatar) {
        setAvatar(fetchedAvatar);
      }
    };
    fetchUserData();
  }, []);

  const roles = [
    {
      type: MessageRoleEnum.User,
      label: username ? username[0].toUpperCase() : "U",
      tooltip: "User",
      color: lighten(theme.palette.primary.main, 0.5),
      avatar: avatar
    },
    {
      type: MessageRoleEnum.Assistant,
      label: <AssistantIcon/>,
      tooltip: "Assistant",
      color: lighten(theme.palette.secondary.main, 0.5),
      avatar: null
    },
    {
      type: MessageRoleEnum.System,
      label: <BuildIcon/>,
      tooltip: "System",
      color: lighten(theme.palette.warning.main, 0.5),
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
              width: 32,
              height: 32,
              transition: "border 0.5s ease, background-color 0.5s ease",
              backgroundColor: role === type ? color : theme.palette.text.disabled,
              border: role !== type || "2px solid transparent",
            }}
            src={avatar && type === MessageRoleEnum.User ? avatar : undefined}
          >
            {!avatar || type !== MessageRoleEnum.User ? label : null}
          </Avatar>
        </Tooltip>
      ))}
    </Stack>
  );
}

export default RoleSelect;