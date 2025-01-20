import {Bookmark} from './Bookmark';
import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class BookmarkClient {

  async fetchBookmarks() {
    const res = await getNestAxiosInstance().get('/bookmarks');
    return res.data;
  }

  async addBookmark(newBookmark: Bookmark) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().post('/bookmarks/bookmark', newBookmark, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateBookmark(bookmark: Bookmark) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put('/bookmarks/bookmark', bookmark, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteBookmark(id: number) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().delete(`/bookmarks/bookmark/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}
