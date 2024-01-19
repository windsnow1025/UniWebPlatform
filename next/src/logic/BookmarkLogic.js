import BookmarkService from "../service/BookmarkService";

export class BookmarkLogic {

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

  async addBookmark(newBookmark) {
    try {
      await this.bookmarkService.addBookmark(newBookmark);
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(error);
        throw new Error('Error');
      }
    }
  }

  async updateBookmark(id, updatedFields) {
    try {
      await this.bookmarkService.updateBookmark(id, updatedFields);
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(error);
        throw new Error('Error');
      }
    }
  }

  async deleteBookmark(id) {
    try {
      await this.bookmarkService.deleteBookmark(id);
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(error);
        throw new Error('Error');
      }
    }
  }

}