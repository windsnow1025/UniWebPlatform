import BookmarkService from "../service/BookmarkService";
import {Bookmark} from "../model/Bookmark";

export class BookmarkLogic {
  private bookmarkService: BookmarkService;

  constructor() {
    this.bookmarkService = new BookmarkService();
  }

  async fetchBookmarks() {
    try {
      return await this.bookmarkService.fetchBookmarks();
    } catch (error) {
      console.error(error);
    }
  }

  async addBookmark(newBookmark: Bookmark) {
    try {
      await this.bookmarkService.addBookmark(newBookmark);
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

  async updateBookmark(bookmark: Bookmark) {
    try {
      await this.bookmarkService.updateBookmark(bookmark);
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

  async deleteBookmark(id: number) {
    try {
      await this.bookmarkService.deleteBookmark(id);
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

}