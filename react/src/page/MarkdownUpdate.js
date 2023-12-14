import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { parseLaTeX, parseMarkdown } from '../util/MarkdownParser';
import { MarkdownLogic } from '../logic/MarkdownLogic';
import '../asset/css/markdown.css';
import AuthDiv from "../component/AuthDiv";
import ThemeSelect from "../component/ThemeSelect";

function MarkdownUpdate() {
  const [markdown, setMarkdown] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const markdownRef = useRef(null);
  const markdownLogic = new MarkdownLogic();

  useEffect(() => {

    const fetchMarkdown = async () => {
      const markdown = await markdownLogic.fetchMarkdown(id);
      setMarkdown({
        title: markdown.title,
        content: markdown.content
      });
      document.title = markdown.title;
      markdownRef.current.innerHTML = parseMarkdown(markdown.content);
      parseLaTeX(markdownRef.current);
    };

    fetchMarkdown();
  }, [id]);

  const handleEdit = () => {
    markdownRef.current.innerHTML = markdown.content;
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (markdownRef.current) {
      const content = markdownRef.current.innerHTML;
      setMarkdown(prev => ({ ...prev, content: content }));
      markdownRef.current.innerHTML = parseMarkdown(content);
      parseLaTeX(markdownRef.current);
    }
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    setMarkdown(prev => ({ ...prev, title: markdownLogic.getTitleFromContent(markdown.content) }));
    await markdownLogic.updateMarkdown(id, markdown.title, markdown.content);
  };

  const handleDelete = async () => {
    await markdownLogic.deleteMarkdown(id);
  };

  return (
    <div>
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <div
        className="markdown-body"
        ref={markdownRef}
        style={{margin: '8px', padding: '8px', minHeight: '24px'}}
        contentEditable={isEditing ? "plaintext-only" : "false"}
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
