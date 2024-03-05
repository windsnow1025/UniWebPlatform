import '../src/asset/css/index.css';

import React, {useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import BookmarkDataGrid from "../app/components/BookmarkDataGrid";
import {useTheme} from "../app/hooks/useTheme";

function Bookmark() {
  const theme = useTheme();

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