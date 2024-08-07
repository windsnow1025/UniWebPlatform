import axios, {AxiosInstance} from 'axios';
import {Bookmark} from './Bookmark';

export default class BookmarkService {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async fetchBookmarks() {
    const res = await this.axiosInstance.get('/bookmarks');
    return res.data;
  }

  async addBookmark(newBookmark: Bookmark) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post('/bookmarks/bookmark', newBookmark, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateBookmark(bookmark: Bookmark) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put('/bookmarks/bookmark', bookmark, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteBookmark(id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/bookmarks/bookmark/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}
