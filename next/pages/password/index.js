import React, {useEffect} from 'react';
import PasswordGenerator from "../../components/password/PasswordGenerator";
import EncryptorDecryptor from "../../components/password/EncryptorDecryptor";

function PasswordEncryptionTool() {

  useEffect(() => {
    document.title = "Password & Encryption Tools";
  }, []);

  return (
    <div className="local-scroll-container">
      <div className="local-scroll-scrollable">
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <PasswordGenerator/>
          <EncryptorDecryptor/>
        </div>
      </div>
    </div>
  );
}

export default PasswordEncryptionTool;
