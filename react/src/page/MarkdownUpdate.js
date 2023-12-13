import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { applyTheme } from "../logic/ThemeLogic";
import { parseLaTeX, parseMarkdown } from '../util/MarkdownParser';
import { MarkdownLogic } from '../logic/MarkdownLogic';
import '../asset/css/markdown.css';

function MarkdownUpdate() {
  const [markdown, setMarkdown] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const markdownRef = useRef(null);
  const markdownLogic = useRef(null);

  useEffect(() => {
    applyTheme(localStorage.getItem("theme"));
    markdownLogic.current = new MarkdownLogic(id);

    const fetchMarkdown = async () => {
      await markdownLogic.current.fetchMarkdown();
      setMarkdown({
        title: markdownLogic.current.title,
        content: markdownLogic.current.content
      });
      document.title = markdownLogic.current.title;
      parseLaTeX(markdownRef.current);
    };

    fetchMarkdown();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      markdownLogic.current.content = markdownRef.current.innerText;
      setMarkdown({
        title: markdownLogic.current.title,
        content: markdownLogic.current.content
      });
    }
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    await markdownLogic.current.updateMarkdown();
    setMarkdown({
      title: markdownLogic.current.title,
      content: parseMarkdown(markdownLogic.current.content)
    });
    parseLaTeX(markdownRef.current);
  };

  const handleDelete = async () => {
    await markdownLogic.current.deleteMarkdown();
  };

  return (
    <div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{ padding: '16px' }}
        contentEditable={isEditing ? "plaintext-only" : "false"}
        dangerouslySetInnerHTML={{ __html: isEditing ? markdown.content : parseMarkdown(markdown.content) }}
      />

      <div className="center">
        {!isEditing && <button onClick={handleEdit}>Edit</button>}
        {isEditing && <button onClick={handleConfirm}>Confirm</button>}
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default MarkdownUpdate;
