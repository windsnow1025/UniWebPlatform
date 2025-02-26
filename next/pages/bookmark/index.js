import React, {useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import HeaderAppBar from "../../app/components/common/header/HeaderAppBar";
import BookmarkDataGrid from "../../app/components/bookmark/BookmarkDataGrid";
import {CssBaseline} from "@mui/material";
import useThemeHandler from "../../app/hooks/useThemeHandler";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Bookmark";
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar title="Bookmarks"/>
        <div className="local-scroll-scrollable">
          <BookmarkDataGrid/>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Index;