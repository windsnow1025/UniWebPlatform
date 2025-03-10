import React, {useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import HeaderAppBar from "../../app/components/common/header/HeaderAppBar";
import BookmarkDataGrid from "../../app/components/bookmark/BookmarkDataGrid";
import useThemeHandler from "../../app/hooks/useThemeHandler";

function Index() {
  useEffect(() => {
    document.title = "Bookmark";
  }, []);

  return (
    <div className="local-scroll-root">
      <HeaderAppBar title="Bookmarks"/>
      <div className="local-scroll-scrollable">
        <BookmarkDataGrid/>
      </div>
    </div>
  );
}

export default Index;