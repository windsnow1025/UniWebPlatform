import {useEffect, useRef} from "react";


function RoleDiv({roleInitial, onRoleChange}) {
  const roleRef = useRef(null);

  useEffect(() => {
    if (roleRef.current) {
      roleRef.current.innerHTML = roleInitial;
    }
  }, [roleInitial]);

  const handleRoleChange = (event) => {
    const newRole = event.target.textContent;
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