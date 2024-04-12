'use client';

import '../src/asset/css/index.css';

import MarkdownList from '../app/components/MarkdownList';
import {ThemeProvider} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import LinkIcon from "@mui/icons-material/Link";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import {CssBaseline, Link} from "@mui/material";
import {createMUITheme} from "../app/utils/Theme";

function Index() {
  const [systemTheme, setSystemTheme] = useState();
  const [muiTheme, setMuiTheme] = useState();

  useEffect(() => {
    setMuiTheme(createMUITheme(systemTheme));
  }, [systemTheme]);

  useEffect(() => {
    document.title = "Windsnow1025";
  }, []);

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme />
          <HeaderAppBar
            title="Windsnow1025"
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <div className="flex-around m-4">
            <Link href="/bookmark" target="_blank" rel="noopener noreferrer">
              <div className="flex-center">
                Bookmarks
                <LinkIcon/>
              </div>
            </Link>
            <Link href="/message" target="_blank" rel="noopener noreferrer">
              <div className="flex-center">
                Message Transmitter
                <LinkIcon/>
              </div>
            </Link>
            <Link href="/password" target="_blank" rel="noopener noreferrer">
              <div className="flex-center">
                Password Generator
                <LinkIcon/>
              </div>
            </Link>
            <Link href="/chat" target="_blank" rel="noopener noreferrer">
              <div className="flex-center">
                AI Chat
                <LinkIcon/>
              </div>
            </Link>
          </div>
          <div className="mx-16">
            <MarkdownList/>
          </div>
        </ThemeProvider>
      }
    </>
  );
}

export default Index;
