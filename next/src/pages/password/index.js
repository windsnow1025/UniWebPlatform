import React, { useState, useEffect } from "react";
import PasswordGenerator from "@/components/password/PasswordGenerator";
import EncryptorDecryptor from "@/components/password/EncryptorDecryptor";
import SecretKeyDialog from "@/components/password/SecretKeyDialog";
import { Button } from "@mui/material";
import {usePageMeta} from "@/hooks/usePageMeta";
import {StorageKeys} from "@/lib/common/Constants";

function PasswordEncryptionTool() {
  const [key, setKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(StorageKeys.SecretKey);
    if (savedKey) setKey(Number(savedKey));
  }, []);

  const handleSetKey = (newKey, remember = true) => {
    setKey(Number(newKey));
    if (remember && newKey) {
      localStorage.setItem(StorageKeys.SecretKey, newKey.toString());
    } else {
      localStorage.removeItem(StorageKeys.SecretKey);
    }
  };

  usePageMeta("Crypto", "Generate secure and customizable passwords by your key.");

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
      <div className="flex flex-col md:flex-row gap-8 justify-center md:items-start">
        <PasswordGenerator keyValue={key} />
        <EncryptorDecryptor keyValue={key} />
      </div>
    </div>
  );
}

export default PasswordEncryptionTool;
