'use client';

import React, {useEffect} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline, Link} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/header/HeaderAppBar";

function Index() {
  const {themeType, setThemeType, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Windsnow1025";
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar title="Windsnow1025"/>
        <div className="local-scroll-scrollable flex-around m-2">
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
      </div>
    </ThemeProvider>
  );
}

export default Index;
