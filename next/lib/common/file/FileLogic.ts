import FileClient from "./FileClient";
import axios from "axios";
import {getAPIBaseURLs} from "@/lib/common/APIConfig";

export default class FileLogic {
  private fileService: FileClient;
  private webUrlOrigin?: string;

  constructor() {
    this.fileService = new FileClient();
  }

  static getFilenameFromUrl(url: string): string {
    return url.split('/').pop() || '';
  }

  static getFilenamesFromUrls(fileUrls: string[]): string[] {
    return fileUrls.map(url => url.split('/').pop() || '');
  }

  static getStorageFilenameFromUrl(url: string, storageUrl: string): string | null {
    if (!url.includes(storageUrl)) {
      return null;
    }

    return FileLogic.getFilenameFromUrl(url);
  }

  static getStorageFilenamesFromUrls(fileUrls: string[], storageUrl: string): string[] {
    return fileUrls
      .map(url => FileLogic.getStorageFilenameFromUrl(url, storageUrl))
      .filter((fileName): fileName is string => fileName !== null);
  }

  async getStorageUrl() {
    try {
      return await this.fileService.getStorageUrl();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to get storage URL');
    }
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

  async cloneFiles(filenames: string[]): Promise<string[]> {
    try {
      return await this.fileService.cloneFiles(filenames);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to clone files');
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
