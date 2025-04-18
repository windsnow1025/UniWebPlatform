import React, {useEffect} from 'react';
import PasswordGenerator from "../../components/password/PasswordGenerator";

function PasswordGeneratorIndex() {

  useEffect(() => {
    document.title = "Password Generator";
  }, []);

  return (
    <div className="local-scroll-container">
      
      <div className="local-scroll-scrollable">
        <PasswordGenerator/>
      </div>
    </div>
  );
}

export default PasswordGeneratorIndex;