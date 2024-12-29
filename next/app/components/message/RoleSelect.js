import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

function RoleSelect({role, setRole}) {
  return (
    <FormControl size="small" className="mt-2">
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        value={role}
        label="Role"
        onChange={e => {
          setRole(e.target.value)
        }}
      >
        <MenuItem value="user">user</MenuItem>
        <MenuItem value="assistant">assistant</MenuItem>
        <MenuItem value="system">system</MenuItem>
      </Select>
    </FormControl>
  );
}

export default RoleSelect;
