import {useEffect, useRef} from "react";


function RoleDiv({role, setRole}) {
  const roleRef = useRef(null);

  useEffect(() => {
    if (roleRef.current) {
      roleRef.current.innerHTML = role;
    }
  }, [role]);

  const handleRoleChange = (event) => {
    const newRole = event.target.textContent;
    setRole(newRole);
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