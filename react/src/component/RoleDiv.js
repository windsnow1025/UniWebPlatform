import {useEffect, useState} from "react";

function RoleDiv({ roleInitial, onRoleChange }) {
  const [role, setRole] = useState(roleInitial);

  useEffect(() => {
    setRole(roleInitial);
  }, [roleInitial]);

  const handleRoleChange = (event) => {
    const newRole = event.target.textContent;
    setRole(newRole);
    onRoleChange(newRole);
  };

  return (
    <div
      contentEditable="plaintext-only"
      onInput={handleRoleChange}
      onBlur={handleRoleChange}
      dangerouslySetInnerHTML={{ __html: role }}
    ></div>
  );
}

export default RoleDiv;
