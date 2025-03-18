import FileClient from "./FileClient";
import axios from "axios";

export default class FileLogic {
  private fileService: FileClient;

  constructor() {
    this.fileService = new FileClient();
  }

  async uploadFiles(files: File[]) {
    try {
      return await this.fileService.uploadFiles(files);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 413) {
          throw new Error('File is too large');
        }
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
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
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
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 404) {
          throw new Error('Files not found');
        }
      }
      console.error(error);
      throw new Error('Failed to delete files');
    }
  }
}
