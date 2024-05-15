'use client';

import React, {useEffect} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline, Link} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/HeaderAppBar";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Windsnow1025";
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <HeaderAppBar
        title="Windsnow1025"
        systemTheme={systemTheme}
        setSystemTheme={setSystemTheme}
      />
      <div className="flex-around m-2">
        <span>My Email: windsnow1024@gmail.com</span>
        <Link
          href="https://github.com/windsnow1025/UniWebPlatform"
          target="_blank"
          rel="noopener noreferrer">
          <div className="flex-around m-2">
            <span className="m-2">My GitHub</span>
            <GitHubIcon/>
          </div>
        </Link>
      </div>
    </ThemeProvider>
  );
}

export default Index;
