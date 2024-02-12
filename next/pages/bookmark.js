import '../src/asset/css/index.css';

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {getInitMUITheme, getLightMUITheme} from '../src/logic/ThemeLogic';
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import BookmarkDataGrid from "../app/components/BookmarkDataGrid";

function Bookmark() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  useEffect(() => {
    document.title = "Bookmark";
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <HeaderAppBar title="Bookmarks"/>
      <BookmarkDataGrid/>
    </ThemeProvider>
  );
}

export default Bookmark;