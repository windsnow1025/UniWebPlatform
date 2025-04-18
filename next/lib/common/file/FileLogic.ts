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
