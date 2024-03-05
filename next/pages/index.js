'use client';

import '../src/asset/css/index.css';

import MarkdownList from '../app/components/MarkdownList';
import {ThemeProvider} from "@mui/material/styles";
import React, {useEffect} from "react";
import LinkIcon from "@mui/icons-material/Link";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import {useTheme} from "../app/hooks/useTheme";
import {CssBaseline} from "@mui/material";

function Index() {
  const theme = useTheme();

  useEffect(() => {
    document.title = "Windsnow1025";
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <HeaderAppBar title="Windsnow1025"/>
      <div className="flex-around m-4">
        <a href="/bookmark" target="_blank" rel="noopener noreferrer">
          <div className="flex-center">
            Bookmarks
            <LinkIcon/>
          </div>
        </a>
        <a href="/message" target="_blank" rel="noopener noreferrer">
          <div className="flex-center">
            Message Transmitter
            <LinkIcon/>
          </div>
        </a>
        <a href="/gpt" target="_blank" rel="noopener noreferrer">
          <div className="flex-center">
            GPT
            <LinkIcon/>
          </div>
        </a>
      </div>
      <div className="flex-around m-4">
        <MarkdownList/>
      </div>
    </ThemeProvider>
  );
}

export default Index;
