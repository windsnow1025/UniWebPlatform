'use client';

import '../src/asset/css/index.css';

import MarkdownList from '../app/components/MarkdownList';
import {ThemeProvider} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import LinkIcon from "@mui/icons-material/Link";
import HeaderAppBar from "../app/components/common/HeaderAppBar";

function Index() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  useEffect(() => {
    document.title = "Windsnow1025";
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
