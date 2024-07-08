import BookmarkService from "../service/BookmarkService";
import {Bookmark} from "../model/Bookmark";
import axios from "axios";

export default class BookmarkLogic {
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

  async addBookmark(bookmark: Bookmark) {
    try {
      await this.bookmarkService.addBookmark(bookmark);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to add bookmark');
    }
  }

  async updateBookmark(bookmark: Bookmark) {
    try {
      await this.bookmarkService.updateBookmark(bookmark);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to update bookmark');
    }
  }

  async deleteBookmark(id: number) {
    try {
      await this.bookmarkService.deleteBookmark(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to delete bookmark');
    }
  }

}