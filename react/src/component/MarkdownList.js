import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MarkdownList() {
  const [markdowns, setMarkdowns] = useState([]);

  useEffect(() => {
    async function fetchMarkdowns() {
      const res = await axios.get('/api/markdown/');
      setMarkdowns(res.data);
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
