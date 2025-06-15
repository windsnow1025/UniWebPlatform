import React, { useEffect, useState } from 'react';
import PasswordGenerator from "../../components/password/PasswordGenerator";
import EncryptorDecryptor from "../../components/password/EncryptorDecryptor";

function PasswordEncryptionTool() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const savedKey = localStorage.getItem('secretKey');
    if (savedKey) setKey(parseInt(savedKey));
  }, []);

  useEffect(() => {
    if (key) localStorage.setItem('secretKey', key.toString());
  }, [key]);

  useEffect(() => {
    document.title = "Password & Encryption Tools";
  }, []);

  return (
    <div className="local-scroll-container">
      <div className="local-scroll-scrollable">
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <PasswordGenerator keyValue={key} setKeyValue={setKey} />
          <EncryptorDecryptor keyValue={key} setKeyValue={setKey} />
        </div>
      </div>
    </div>
  );
}

export default PasswordEncryptionTool;