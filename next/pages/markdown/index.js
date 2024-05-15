import React, {useEffect, useState} from 'react';
import {MarkdownLogic} from "../../src/logic/MarkdownLogic";
import {
  Button,
  CssBaseline,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper
} from "@mui/material";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import {ThemeProvider} from "@mui/material/styles";
import useThemeHandler from "../../app/hooks/useThemeHandler";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  const title = "Markdown Blogs"
  useEffect(() => {
    document.title = title;
  }, []);

  const [markdowns, setMarkdowns] = useState([]);
  const markdownLogic = new MarkdownLogic();

  useEffect(() => {
    async function fetchMarkdowns() {
      const markdowns = await markdownLogic.fetchMarkdowns();
      if (markdowns) {
        setMarkdowns(markdowns);
      }
    }

    fetchMarkdowns();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <HeaderAppBar
        title={title}
        systemTheme={systemTheme}
        setSystemTheme={setSystemTheme}
      />
      <Paper elevation={4} className="m-8 p-8">
        <div className="flex-between">
          <Button variant="outlined">
            <Link
              href="/markdown/add"
              target="_blank"
              rel="noopener noreferrer"
            >
              New Markdown
            </Link>
          </Button>
        </div>
        <List>
          {markdowns.map((markdown, index) => (
            <div key={markdown.id}>
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Link
                      href={`/markdown/update/${markdown.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="secondary"
                    >
                      {markdown.title}
                    </Link>
                  }
                />
              </ListItem>
              {index < markdowns.length - 1 && <Divider/>}
            </div>
          ))}
        </List>
      </Paper>
    </ThemeProvider>
  );
}

export default Index;