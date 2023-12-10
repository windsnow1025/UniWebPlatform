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
                        <a href={`/html/markdown-update.html?id=${markdown.id}`}>
                            {markdown.title}
                        </a>
                    </li>
                ))}
            </ul>
            <a href="./html/markdown-add.html">Add Markdown</a>
        </div>
    );
}

export default MarkdownList;
