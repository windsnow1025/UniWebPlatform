import React, {useEffect, useState} from 'react';
import {Avatar, lighten, Stack, Tooltip, useTheme} from "@mui/material";
import {MessageRole} from "../../../src/conversation/chat/Message";
import UserLogic from "../../../src/common/user/UserLogic";

function RoleSelect({role, setRole}) {
  const [username, setUsername] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchUsername = async () => {
      const userLogic = new UserLogic();
      const fetchedUsername = await userLogic.fetchUsername();
      if (fetchedUsername) {
        setUsername(fetchedUsername);
      }
    };
    fetchUsername();
  }, []);

  const roles = [
    {
      type: MessageRole.User,
      label: username ? username[0].toUpperCase() : "U",
      tooltip: "User",
      color: lighten(theme.palette.primary.main, 0.5)
    },
    {
      type: MessageRole.Assistant,
      label: "A",
      tooltip: "Assistant",
      color: lighten(theme.palette.secondary.main, 0.5)
    },
    {
      type: MessageRole.System,
      label: "S",
      tooltip: "System",
      color: lighten(theme.palette.warning.main, 0.5)
    }
  ];

  return (
    <Stack direction="row" spacing={2}>
      {roles.map(({type, label, tooltip, color}) => (
        <Tooltip key={type} title={tooltip} arrow>
          <Avatar
            onClick={() => setRole(type)}
            sx={{
              cursor: "pointer",
              backgroundColor: role === type ? color : theme.palette.text.disabled,
              transition: "background-color 0.5s ease",
              width: 32,
              height: 32
            }}
          >
            {label}
          </Avatar>
        </Tooltip>
      ))}
    </Stack>
  );
}

export default RoleSelect;