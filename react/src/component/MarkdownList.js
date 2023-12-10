import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
            <Link to={`/markdown/update/${markdown.id}`}>
              {markdown.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/markdown/add">Add Markdown</Link>
    </div>
  );
}

export default MarkdownList;
