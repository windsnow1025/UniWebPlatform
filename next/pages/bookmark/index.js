import React, {useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
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
      <HeaderAppBar
        title="Bookmarks"
        systemTheme={systemTheme}
        setSystemTheme={setSystemTheme}
      />
      <BookmarkDataGrid/>
    </ThemeProvider>
  );
}

export default Index;