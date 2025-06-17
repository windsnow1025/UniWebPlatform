import React, {useEffect, useState} from 'react';
import PasswordGenerator from "../../components/password/PasswordGenerator";
import EncryptorDecryptor from "../../components/password/EncryptorDecryptor";
import SecretKeyInput from "../../components/password/SecretKeyInput";

function PasswordEncryptionTool() {
  const [key, setKey] = useState(0);
  const [showKey, setShowKey] = useState(false);

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
        <div className="max-w-md mx-auto my-4">
          <SecretKeyInput keyValue={key} setKeyValue={setKey} showKey={showKey} setShowKey={setShowKey}/>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <PasswordGenerator keyValue={key}/>
          <EncryptorDecryptor keyValue={key}/>
        </div>
      </div>
    </div>
  );
}

export default PasswordEncryptionTool;