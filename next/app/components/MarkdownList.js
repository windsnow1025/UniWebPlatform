import React, {useEffect, useState} from 'react';
import {MarkdownLogic} from "../../src/logic/MarkdownLogic";
import {Divider, IconButton, Link, List, ListItem, ListItemText, Paper, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

function MarkdownList() {
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
    <Paper elevation={4} className="p-8">
      <div className="flex-between">
        <Typography variant="h6">Markdown Blogs</Typography>
        <Link
          href="/markdown/add"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton aria-label="add">
            <AddIcon/>
          </IconButton>
        </Link>
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
  );
}

export default MarkdownList;