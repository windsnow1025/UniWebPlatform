import React, {useEffect} from 'react';
import HeaderAppBar from "../../app/components/common/header/HeaderAppBar";
import PasswordGenerator from "../../app/components/password/PasswordGenerator";

function PasswordGeneratorIndex() {

  useEffect(() => {
    document.title = "Password Generator";
  }, []);

  return (
    <div className="local-scroll-root">
      <HeaderAppBar title="Password Generator"/>
      <div className="local-scroll-scrollable">
        <PasswordGenerator/>
      </div>
    </div>
  );
}

export default PasswordGeneratorIndex;