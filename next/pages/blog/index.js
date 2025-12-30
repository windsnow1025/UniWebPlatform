import React, {useEffect, useState} from 'react';
import MarkdownLogic from "../../lib/markdown/MarkdownLogic";
import {Button, Divider, Link, List, ListItem, ListItemText, Paper, TextField, InputAdornment} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Head from "next/head";

function Index() {
  const [markdowns, setMarkdowns] = useState([]);
  const [allMarkdowns, setAllMarkdowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const markdownLogic = new MarkdownLogic();

  useEffect(() => {
    async function fetchMarkdowns() {
      const markdowns = await markdownLogic.fetchMarkdowns();
      if (markdowns) {
        setAllMarkdowns(markdowns);
        setMarkdowns(markdowns);
      }
    }

    fetchMarkdowns();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setMarkdowns(allMarkdowns);
    } else {
      const filtered = allMarkdowns.filter(markdown =>
        markdown.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        markdown.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMarkdowns(filtered);
    }
  }, [searchTerm, allMarkdowns]);

  return (
    <div className="local-scroll-container">
      <Head>
        <meta name="description" content="Blogs with Markdown and LaTeX support for personal usage."/>
        <title>Markdown Blogs - Windsnow1025</title>
      </Head>
      <div className="local-scroll-scrollable">
        <Paper elevation={4} className="m-8 p-8">
          <div className="flex-between gap-4 mb-4">
            <Button
              variant="contained"
              color="primary"
              href="/markdown/add"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<AddIcon/>}
            >
              New Markdown
            </Button>
            <TextField
              placeholder="Search blogs..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon/>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <List>
            {markdowns.map((markdown, index) => (
              <div key={markdown.id}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={
                      <Link
                        href={`/blog/update/${markdown.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="secondary"
                      >
                        {markdown.title}
                      </Link>
                    }
                    secondary={`Updated: ${new Date(markdown.updatedAt).toLocaleDateString()}`}
                  />
                </ListItem>
                {index < markdowns.length - 1 && <Divider/>}
              </div>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default Index;
