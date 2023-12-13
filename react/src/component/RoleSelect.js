import React, { useState, useEffect } from 'react';

function RoleSelect({ roleInitial, onRoleChange }) {
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
    <select
      name="role"
      title="role"
      value={role}
      onChange={handleRoleChange}
    >
      <option value="user">user</option>
      <option value="assistant">assistant</option>
      <option value="system">system</option>
    </select>
  );
}

export default RoleSelect;
