import axios, { AxiosInstance } from 'axios';
import {Bookmark} from '../model/Bookmark';

export default class BookmarkService {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async fetchBookmarks() {
    const res = await this.axiosInstance.get('/bookmark/');
    return res.data;
  }

  async addBookmark(newBookmark: Bookmark) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post('/bookmark/', newBookmark, {
      headers: { Authorization: token }
    });
  }

  async updateBookmark(id: number, updatedFields: Bookmark) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/bookmark/${id}`, updatedFields, {
      headers: { Authorization: token }
    });
  }

  async deleteBookmark(id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/bookmark/${id}`, {
      headers: { Authorization: token }
    });
  }
}
