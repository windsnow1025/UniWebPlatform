import React, {useState, useEffect} from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

function RoleSelect({roleInitial, onRoleChange}) {
  const [role, setRole] = useState(roleInitial);

  useEffect(() => {
    setRole(roleInitial);
  }, [roleInitial]);

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setRole(newRole);
    onRoleChange(newRole);
  };

  return (
    <FormControl size="small" className="mt-2">
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        value={role}
        label="Role"
        onChange={handleRoleChange}
      >
        <MenuItem value="user">user</MenuItem>
        <MenuItem value="assistant">assistant</MenuItem>
        <MenuItem value="system">system</MenuItem>
      </Select>
    </FormControl>
  );
}

export default RoleSelect;
