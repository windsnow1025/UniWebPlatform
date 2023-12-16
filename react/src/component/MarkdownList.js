import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {MarkdownLogic} from "../logic/MarkdownLogic";

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
      <p>Markdowns</p>
      <ul>
        {markdowns.map(markdown => (
          <li key={markdown.id}>
            <a href={`/markdown/update/${markdown.id}`} target="_blank" rel="noopener noreferrer">
              {markdown.title}
            </a>
          </li>
        ))}
      </ul>
      <a href="/markdown/add" target="_blank" rel="noopener noreferrer">Add Markdown</a>
    </div>
  );
}

export default MarkdownList;
