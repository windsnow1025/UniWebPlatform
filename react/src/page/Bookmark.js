import React, {useState, useEffect} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';
import {BookmarkLogic} from "../logic/BookmarkLogic";
import {getInitMUITheme} from "../logic/ThemeLogic";

function Bookmark() {
  const [theme, setTheme] = useState(getInitMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
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
    try {
      const bookmarks = await bookmarkLogic.fetchBookmarks();
      setBookmarks(bookmarks);
      // Initialize edit states
      let initEditStates = {};
      bookmarks.forEach(bookmark => {
        initEditStates[bookmark.id] = false;
      });
      setEditStates(initEditStates);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddBookmark = async () => {
    try {
      await bookmarkLogic.addBookmark(newBookmark);
      loadBookmarks();
      setNewBookmark({firstTitle: '', secondTitle: '', url: '', comment: ''});
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      }
    }
  };

  const handleUpdateBookmark = async (id, updatedFields) => {
    const updatedBookmark = {...bookmarks.find(bookmark => bookmark.id === id), ...updatedFields};
    try {
      await bookmarkLogic.updateBookmark(id, updatedBookmark);
      loadBookmarks();
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      }
    }
  };

  const handleEditableContentChange = (id, field, value) => {
    setEditableContents(prev => ({
      ...prev,
      [id]: {...prev[id], [field]: value}
    }));
  };

  const handleDeleteBookmark = async (id) => {
    try {
      await bookmarkLogic.deleteBookmark(id);
      loadBookmarks();
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      }
    }
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
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
      <div className="search-container">
        <input type="text" value={searchGlobal} onChange={e => setSearchGlobal(e.target.value)}
               placeholder="Global Search..."/>
        <input type="text" value={searchFirstTitle} onChange={e => setSearchFirstTitle(e.target.value)}
               placeholder="Search by First Title..."/>
        <input type="text" value={searchSecondTitle} onChange={e => setSearchSecondTitle(e.target.value)}
               placeholder="Search by Second Title..."/>
        <input type="text" value={searchUrl} onChange={e => setSearchUrl(e.target.value)}
               placeholder="Search by URL..."/>
        <input type="text" value={searchComment} onChange={e => setSearchComment(e.target.value)}
               placeholder="Search by Comment..."/>
      </div>
      <table id="bookmarksTable">
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
            <button onClick={handleAddBookmark}>Add</button>
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
              <button onClick={() => toggleEditState(bookmark.id)}>
                {editStates[bookmark.id] ? 'Submit' : 'Edit'}
              </button>
              <button onClick={() => handleDeleteBookmark(bookmark.id)}>Delete</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </ThemeProvider>
  );
}

export default Bookmark;
