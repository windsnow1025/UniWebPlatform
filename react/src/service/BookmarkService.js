import axios from 'axios';

export default class BookmarkService {
  constructor() {
    this.axiosInstance = axios.create({ baseURL: global.nodeAPIBaseURL });
  }

  async fetchBookmarks() {
    const res = await this.axiosInstance.get('/bookmark/');
    return res.data;
  }

  async addBookmark(newBookmark) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post('/bookmark/', newBookmark, {
      headers: { Authorization: token }
    });
  }

  async updateBookmark(id, updatedFields) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/bookmark/${id}`, updatedFields, {
      headers: { Authorization: token }
    });
  }

  async deleteBookmark(id) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/bookmark/${id}`, {
      headers: { Authorization: token }
    });
  }
}
