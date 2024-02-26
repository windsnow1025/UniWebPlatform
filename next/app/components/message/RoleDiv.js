import {useEffect, useRef, useState} from "react";


function RoleDiv({ roleInitial, onRoleChange }) {
  const [role, setRole] = useState(roleInitial);
  const roleRef = useRef(null);

  useEffect(() => {
    if (roleRef.current) {
      roleRef.current.innerHTML = role;
    }
  }, [role]);

  const handleRoleChange = (event) => {
    const newRole = event.target.textContent;
    setRole(newRole);
    onRoleChange(newRole);
  };

  return (
    <div
      contentEditable="plaintext-only"
      onBlur={handleRoleChange}
      ref={roleRef}
    />
  );
}

export default RoleDiv;