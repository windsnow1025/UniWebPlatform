import '../src/asset/css/App.css';

import React, {useState, useEffect} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import AuthDiv from '../src/component/AuthDiv';
import ThemeSelect from '../src/component/ThemeSelect';
import {BookmarkLogic} from "../src/logic/BookmarkLogic";
import {getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";

function Bookmark() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({firstTitle: '', secondTitle: '', url: '', comment: ''});
  const [editStates, setEditStates] = useState({});
  const [editableContents, setEditableContents] = useState({});
  const [searchGlobal, setSearchGlobal] = useState('');
  const [searchFirstTitle, setSearchFirstTitle] = useState('');
  const [searchSecondTitle, setSearchSecondTitle] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [searchComment, setSearchComment] = useState('');

  const bookmarkLogic = new BookmarkLogic();

  useEffect(() => {
    loadBookmarks();
    document.title = "Bookmark";
  }, []);

  const loadBookmarks = async () => {
    const bookmarks = await bookmarkLogic.fetchBookmarks();

    if (!bookmarks) {
      return;
    }

    setBookmarks(bookmarks);
    // Initialize edit states
    let initEditStates = {};
    bookmarks.forEach(bookmark => {
      initEditStates[bookmark.id] = false;
    });
    setEditStates(initEditStates);
  };

  const handleAddBookmark = async () => {
    await bookmarkLogic.addBookmark(newBookmark);
    loadBookmarks();
    setNewBookmark({firstTitle: '', secondTitle: '', url: '', comment: ''});
  };

  const handleUpdateBookmark = async (id, updatedFields) => {
    const updatedBookmark = {...bookmarks.find(bookmark => bookmark.id === id), ...updatedFields};
    await bookmarkLogic.updateBookmark(id, updatedBookmark);
    loadBookmarks();
  };

  const handleEditableContentChange = (id, field, value) => {
    setEditableContents(prev => ({
      ...prev,
      [id]: {...prev[id], [field]: value}
    }));
  };

  const handleDeleteBookmark = async (id) => {
    await bookmarkLogic.deleteBookmark(id);
    loadBookmarks();
  };

  const toggleEditState = (id) => {
    setEditStates(prev => ({...prev, [id]: !prev[id]}));
    if (!editStates[id]) {
      // Entering edit mode
      const bookmarkToEdit = bookmarks.find(bookmark => bookmark.id === id);
      setEditableContents(prev => ({
        ...prev,
        [id]: {
          firstTitle: bookmarkToEdit.first_title,
          secondTitle: bookmarkToEdit.second_title,
          url: bookmarkToEdit.url,
          comment: bookmarkToEdit.comment
        }
      }));
    } else {
      // Leaving edit mode
      handleUpdateBookmark(id, editableContents[id]);
    }
  };

  const filteredBookmarks = bookmarkLogic.filterBookmarks(bookmarks, {
    searchGlobal, searchFirstTitle, searchSecondTitle, searchUrl, searchComment
  });

  return (
    <ThemeProvider theme={theme}>
      <h1 className="center">Bookmarks</h1>
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <div className="center">
        <TextField
          label="Global Search..."
          variant="outlined"
          type="text"
          value={searchGlobal}
          onChange={(e) => setSearchGlobal(e.target.value)}
          style={{margin: 8}}
        />
        <TextField
          label="Search by First Title..."
          variant="outlined"
          type="text"
          value={searchFirstTitle}
          onChange={(e) => setSearchFirstTitle(e.target.value)}
          style={{margin: 8}}
        />
        <TextField
          label="Search by Second Title..."
          variant="outlined"
          type="text"
          value={searchSecondTitle}
          onChange={(e) => setSearchSecondTitle(e.target.value)}
          style={{margin: 8}}
        />
        <TextField
          label="Search by URL..."
          variant="outlined"
          type="text"
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
          style={{margin: 8}}
        />
        <TextField
          label="Search by Comment..."
          variant="outlined"
          type="text"
          value={searchComment}
          onChange={(e) => setSearchComment(e.target.value)}
          style={{margin: 8}}
        />
      </div>
      <div style={{padding: 16}}>
        <table>
          <thead>
          <tr>
            <th>First Title</th>
            <th>Second Title</th>
            <th>URL</th>
            <th>Comment</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {/* Add bookmark row */}
          <tr>
            <td contentEditable="plaintext-only"
                onBlur={e => setNewBookmark({...newBookmark, firstTitle: e.target.textContent})}>
              {newBookmark.firstTitle}</td>
            <td contentEditable="plaintext-only"
                onBlur={e => setNewBookmark({...newBookmark, secondTitle: e.target.textContent})}>
              {newBookmark.secondTitle}</td>
            <td contentEditable="plaintext-only"
                onBlur={e => setNewBookmark({...newBookmark, url: e.target.textContent})}>
              {newBookmark.url}</td>
            <td contentEditable="plaintext-only"
                onBlur={e => setNewBookmark({...newBookmark, comment: e.target.textContent})}>
              {newBookmark.comment}</td>
            <td></td>
            <td>
              <Button variant="outlined" size="small" onClick={handleAddBookmark}>
                Add
              </Button>
            </td>
          </tr>
          {/* Bookmark rows */}
          {filteredBookmarks.map(bookmark => (
            <tr key={bookmark.id}>
              <td contentEditable={editStates[bookmark.id]}
                  onBlur={e => handleEditableContentChange(bookmark.id, 'firstTitle', e.target.textContent)}>
                {bookmark.first_title}</td>
              <td contentEditable={editStates[bookmark.id]}
                  onBlur={e => handleEditableContentChange(bookmark.id, 'secondTitle', e.target.textContent)}>
                {bookmark.second_title}</td>
              <td contentEditable={editStates[bookmark.id]}
                  onBlur={e => handleEditableContentChange(bookmark.id, 'url', e.target.textContent)}
                  className="word-break">
                {bookmark.url}</td>
              <td contentEditable={editStates[bookmark.id]}
                  onBlur={e => handleEditableContentChange(bookmark.id, 'comment', e.target.textContent)}>
                {bookmark.comment}</td>
              <td className="word-break">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a>
              </td>
              <td>
                <Button variant="outlined" size="small" onClick={() => toggleEditState(bookmark.id)}>
                  {editStates[bookmark.id] ? 'Submit' : 'Edit'}
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleDeleteBookmark(bookmark.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </ThemeProvider>
  );
}

export default Bookmark;
