import {getOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {BookmarkReqDto, BookmarkResDto, BookmarksApi} from "@/client";

export default class BookmarkClient {
  async fetchBookmarks(): Promise<BookmarkResDto[]> {
    const api = new BookmarksApi(getOpenAPIConfiguration());
    const res = await api.bookmarksControllerFindAll();
    return res.data;
  }

  async addBookmark(bookmark: BookmarkReqDto): Promise<BookmarkResDto> {
    const api = new BookmarksApi(getOpenAPIConfiguration());
    const res = await api.bookmarksControllerCreate(bookmark);
    return res.data;
  }

  async updateBookmark(id: number, bookmark: BookmarkReqDto): Promise<BookmarkResDto> {
    const api = new BookmarksApi(getOpenAPIConfiguration());
    const res = await api.bookmarksControllerUpdate(id, bookmark);
    return res.data;
  }

  async deleteBookmark(id: number): Promise<void> {
    const api = new BookmarksApi(getOpenAPIConfiguration());
    await api.bookmarksControllerDelete(id);
  }
}
