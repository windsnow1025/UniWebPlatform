import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {MessageRole} from "../../../src/conversation/chat/Message";

function RoleSelect({role, setRole}) {
  return (
    <FormControl size="small" className="mt-2">
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        value={role}
        label="Role"
        variant="outlined"
        onChange={e => {
          setRole(e.target.value)
        }}
      >
        <MenuItem value={MessageRole.User}>{MessageRole.User}</MenuItem>
        <MenuItem value={MessageRole.Assistant}>{MessageRole.Assistant}</MenuItem>
        <MenuItem value={MessageRole.System}>{MessageRole.System}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default RoleSelect;
