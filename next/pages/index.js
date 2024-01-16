'use client';

import '../src/asset/css/App.css';

import MarkdownList from '../src/component/MarkdownList';
import ThemeSelect from "../src/component/ThemeSelect";
import AuthDiv from "../src/component/AuthDiv";
import {ThemeProvider} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {AppBar} from "@mui/material";

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
      <AppBar position="static">
        <h1 className="center">Windsnow1025</h1>
      </AppBar>
      <div className="Flex-space-around" style={{margin: 16}}>
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <div className="Flex-space-around" style={{margin: 16}}>
        <a href="/bookmark" target="_blank" rel="noopener noreferrer">Bookmarks</a>
        <a href="/message" target="_blank" rel="noopener noreferrer">Message Transmitter</a>
        <a href="/gpt" target="_blank" rel="noopener noreferrer">GPT</a>
      </div>
      <div className="Flex-space-around" style={{margin: 16}}>
        <MarkdownList/>
      </div>
    </ThemeProvider>
  );
}

export default Index;
