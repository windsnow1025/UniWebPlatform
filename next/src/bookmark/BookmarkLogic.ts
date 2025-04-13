import BookmarkClient from "./BookmarkClient";
import {Bookmark} from "./Bookmark";
import axios from "axios";
import {BookmarkReqDto, BookmarkResDto} from "@/client";

export default class BookmarkLogic {
  private bookmarkService: BookmarkClient;

  constructor() {
    this.bookmarkService = new BookmarkClient();
  }

  async fetchBookmarks(): Promise<BookmarkResDto[]> {
    try {
      return await this.bookmarkService.fetchBookmarks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
      }
      console.error(error);
      throw new Error('Failed to fetch bookmarks');
    }
  }

  async addBookmark(bookmark: BookmarkReqDto): Promise<BookmarkResDto> {
    try {
      return await this.bookmarkService.addBookmark(bookmark);
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

  async updateBookmark(id: number, bookmark: BookmarkReqDto): Promise<BookmarkResDto> {
    try {
      return await this.bookmarkService.updateBookmark(id, bookmark);
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

  async deleteBookmark(id: number): Promise<void> {
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