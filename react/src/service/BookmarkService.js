import axios from 'axios';

export default class BookmarkService {

  async fetchBookmarks() {
    const res = await axios.get('/api/bookmark/');
    return res.data;
  }

  async addBookmark(newBookmark) {
    const token = localStorage.getItem('token');
    await axios.post('/api/bookmark/', { data: newBookmark }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async updateBookmark(id, updatedFields) {
    const token = localStorage.getItem('token');
    await axios.put(`/api/bookmark/${id}`, { data: updatedFields }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async deleteBookmark(id) {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/bookmark/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
