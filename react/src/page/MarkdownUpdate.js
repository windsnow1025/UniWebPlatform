import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applyTheme } from "../manager/ThemeManager";
import { parseLaTeX, parseMarkdown } from '../util/MarkdownParser';
import { MarkdownService } from '../service/MarkdownService';
import '../markdown.css';

function MarkdownUpdate() {
  const [markdown, setMarkdown] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const markdownRef = useRef(null); // useRef to reference the div
  const navigate = useNavigate();
  const { id } = useParams(); // get the id from the URL

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    applyTheme(theme);

    const fetchMarkdown = async () => {
      const service = new MarkdownService(id);
      await service.fetchMarkdown();
      setMarkdown({ title: service.title, content: service.content });
      document.title = service.title;
      parseLaTeX(markdownRef.current);
    };

    fetchMarkdown();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      setMarkdown({ ...markdown, content: markdownRef.current.innerText });
    }
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    const service = new MarkdownService(id);
    await service.updateMarkdown({ ...markdown, content: parseMarkdown(markdown.content) });
    // Update the displayed markdown
    setMarkdown({ ...markdown, content: parseMarkdown(markdown.content) });
    parseLaTeX(markdownRef.current);
  };

  const handleDelete = async () => {
    const service = new MarkdownService(id);
    await service.deleteMarkdown();
    navigate('/');
  };

  return (
    <div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{ padding: '16px' }}
        contentEditable={isEditing}
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
