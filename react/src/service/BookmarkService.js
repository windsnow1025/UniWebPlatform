import axios from 'axios';

export default class BookmarkService {
  constructor(token) {
    this.token = token;
  }

  async fetchBookmarks() {
    const res = await axios.get('/api/bookmark/');
    return res.data;
  }

  async addBookmark(newBookmark) {
    await axios.post('/api/bookmark/', { data: newBookmark }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  async updateBookmark(id, updatedFields) {
    await axios.put(`/api/bookmark/${id}`, { data: updatedFields }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  async deleteBookmark(id) {
    await axios.delete(`/api/bookmark/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }
}
