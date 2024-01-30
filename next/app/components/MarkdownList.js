import React, { useEffect, useState } from 'react';
import {MarkdownLogic} from "../../src/logic/MarkdownLogic";
import {Button, IconButton, List, ListItem, ListItemText, Paper} from "@mui/material";
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
    <Paper elevation={4} className="m-2 p-4 rounded-lg">
      <div>
        <span>Markdowns</span>
        <span>
          <a href="/markdown-add" target="_blank" rel="noopener noreferrer">
            <IconButton aria-label="add">
              <AddIcon/>
            </IconButton>
          </a>
        </span>
      </div>
      <List>
        {markdowns.map(markdown => (
          <ListItem key={markdown.id} disablePadding>
            <ListItemText
              primary={
                <a href={`/markdown-update?id=${markdown.id}`} target="_blank" rel="noopener noreferrer">
                  {markdown.title}
                </a>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default MarkdownList;
