import FileClient from "./FileClient";
import axios from "axios";

export default class FileLogic {
  private fileService: FileClient;

  constructor() {
    this.fileService = new FileClient();
  }

  static getFileNamesFromUrls(fileUrls: string[]): string[] {
    return fileUrls.map(url => url.split('/').pop() || '');
  }

  async uploadFiles(files: File[]) {
    try {
      return await this.fileService.uploadFiles(files);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error("Upload failed: file in use, folder paste not supported, or connection lost.");        }
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to upload file');
    }
  }

  async fetchFiles(): Promise<string[]> {
    try {
      return await this.fileService.fetchFiles();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to fetch files');
    }
  }

  async deleteFiles(filenames: string[]): Promise<void> {
    try {
      await this.fileService.deleteFiles(filenames);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to delete files');
    }
  }
}
