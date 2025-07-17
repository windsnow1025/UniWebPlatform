import React, { useState, useEffect } from "react";
import PasswordGenerator from "../../components/password/PasswordGenerator";
import EncryptorDecryptor from "../../components/password/EncryptorDecryptor";
import SecretKeyDialog from "../../components/password/SecretKeyDialog";
import { Button } from "@mui/material";

function PasswordEncryptionTool() {
  const [key, setKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('secretKey');
    if (savedKey) setKey(Number(savedKey));
  }, []);

  const handleSetKey = (newKey, remember = true) => {
    setKey(Number(newKey));
    if (remember && newKey) {
      localStorage.setItem('secretKey', newKey.toString());
    } else {
      localStorage.removeItem('secretKey');
    }
  };

  return (
    <div>
      <div className="flex-center mt-4">
        <Button variant="outlined" onClick={() => setDialogOpen(true)}>
          Set Secret Key
        </Button>
      </div>
      <SecretKeyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        keyValue={key}
        setKeyValue={handleSetKey}
      />
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <PasswordGenerator keyValue={key} />
        <EncryptorDecryptor keyValue={key} />
      </div>
    </div>
  );
}

export default PasswordEncryptionTool;
