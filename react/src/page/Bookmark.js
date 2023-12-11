import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';

function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({firstTitle: '', secondTitle: '', url: '', comment: ''});
  const [editStates, setEditStates] = useState({});
  const [editableContents, setEditableContents] = useState({});
  const [searchGlobal, setSearchGlobal] = useState('');
  const [searchFirstTitle, setSearchFirstTitle] = useState('');
  const [searchSecondTitle, setSearchSecondTitle] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [searchComment, setSearchComment] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/bookmark/', {
        headers: {Authorization: `Bearer ${token}`}
      });
      sortAndSetBookmarks(res.data);
      // Initialize edit states
      let initEditStates = {};
      res.data.forEach(bookmark => {
        initEditStates[bookmark.id] = false;
      });
      setEditStates(initEditStates);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const sortAndSetBookmarks = (bookmarksArray) => {
    bookmarksArray.sort((a, b) => {
      if (a.first_title < b.first_title) return -1;
      if (a.first_title > b.first_title) return 1;
      if (a.second_title < b.second_title) return -1;
      if (a.second_title > b.second_title) return 1;
      if (a.comment < b.comment) return -1;
      if (a.comment > b.comment) return 1;
      return 0;
    });
    setBookmarks(bookmarksArray);
  };

  const handleAddBookmark = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/bookmark/', {data: newBookmark}, {
        headers: {Authorization: `Bearer ${token}`}
      });
      fetchBookmarks();
      setNewBookmark({firstTitle: '', secondTitle: '', url: '', comment: ''});
    } catch (error) {
      console.error('Error adding bookmark:', error);
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

  const handleUpdateBookmark = async (id, updatedFields) => {
    const updatedBookmark = {...bookmarks.find(bookmark => bookmark.id === id), ...updatedFields};
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/bookmark/${id}`, {data: updatedBookmark}, {
        headers: {Authorization: `Bearer ${token}`}
      });
      fetchBookmarks();
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleEditableContentChange = (id, field, value) => {
    setEditableContents(prev => ({
      ...prev,
      [id]: {...prev[id], [field]: value}
    }));
  };

  const handleDeleteBookmark = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/bookmark/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
      });
      fetchBookmarks();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    (searchGlobal === '' ||
      bookmark.first_title.toLowerCase().includes(searchGlobal.toLowerCase()) ||
      bookmark.second_title.toLowerCase().includes(searchGlobal.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchGlobal.toLowerCase()) ||
      bookmark.comment.toLowerCase().includes(searchGlobal.toLowerCase())) &&
    (searchFirstTitle === '' || bookmark.first_title.toLowerCase().includes(searchFirstTitle.toLowerCase())) &&
    (searchSecondTitle === '' || bookmark.second_title.toLowerCase().includes(searchSecondTitle.toLowerCase())) &&
    (searchUrl === '' || bookmark.url.toLowerCase().includes(searchUrl.toLowerCase())) &&
    (searchComment === '' || bookmark.comment.toLowerCase().includes(searchComment.toLowerCase()))
  );


  return (
    <div>
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
                onBlur={e => handleEditableContentChange(bookmark.id, 'firstTitle', e.target.textContent)}
                suppressContentEditableWarning={true}>
              {bookmark.first_title}</td>
            <td contentEditable={editStates[bookmark.id]}
                onBlur={e => handleEditableContentChange(bookmark.id, 'secondTitle', e.target.textContent)}
                suppressContentEditableWarning={true}>
              {bookmark.second_title}</td>
            <td contentEditable={editStates[bookmark.id]}
                onBlur={e => handleEditableContentChange(bookmark.id, 'url', e.target.textContent)}
                suppressContentEditableWarning={true}
                className="word-break">
              {bookmark.url}</td>
            <td contentEditable={editStates[bookmark.id]}
                onBlur={e => handleEditableContentChange(bookmark.id, 'comment', e.target.textContent)}
                suppressContentEditableWarning={true}>
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
    </div>
  );
}

export default Bookmark;
