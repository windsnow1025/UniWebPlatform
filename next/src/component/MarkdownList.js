import React, { useEffect, useState } from 'react';
import {MarkdownLogic} from "../logic/MarkdownLogic";
import {Button, List, ListItem, ListItemButton, ListItemText} from "@mui/material";

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
    <div>
      <p>
        Markdowns
        <a href="/markdown-add" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" style={{margin: 4}}>Add Markdown</Button>
        </a>
      </p>
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
    </div>
  );
}

export default MarkdownList;
