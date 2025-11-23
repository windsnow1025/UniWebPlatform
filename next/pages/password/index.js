import React, { useState, useEffect } from "react";
import PasswordGenerator from "../../components/password/PasswordGenerator";
import EncryptorDecryptor from "../../components/password/EncryptorDecryptor";
import SecretKeyDialog from "../../components/password/SecretKeyDialog";
import { Button } from "@mui/material";
import Head from "next/head";
import {StorageKeys} from "../../lib/common/Constants";

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

  return (
    <div>
      <Head>
        <meta name="description" content="Generate secure and customizable passwords by your key." />
        <title>Password & Encryption - Windsnow1025</title>
      </Head>

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
