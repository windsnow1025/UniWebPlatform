import React, {useEffect} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import HeaderAppBar from "../../app/components/common/header/HeaderAppBar";
import useThemeHandler from "../../app/hooks/useThemeHandler";
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