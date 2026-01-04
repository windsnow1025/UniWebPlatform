import FileClient from "./FileClient";
import axios from "axios";
import {handleError} from "@/lib/common/ErrorHandler";
import {getAPIBaseURLs} from "@/lib/common/APIConfig";

export default class FileLogic {
  private fileClient: FileClient;

  constructor() {
    this.fileClient = new FileClient();
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

  async getStorageFilenameFromUrl(url: string): Promise<string | null> {
    const storageUrl = await this.getStorageUrl();
    if (!url.includes(storageUrl)) {
      return null;
    }

    return FileLogic.getFilenameFromUrl(url);
  }

  async getStorageFilenamesFromUrls(fileUrls: string[]): Promise<string[]> {
    const storageUrl = await this.getStorageUrl();
    return fileUrls
      .map(url => FileLogic.getStorageFilenameFromUrl(url, storageUrl))
      .filter((fileName): fileName is string => fileName !== null);
  }

  async getStorageUrl() {
    try {
      return await this.fileClient.getStorageUrl();
    } catch (error) {
      handleError(error, 'Failed to get storage URL');
    }
  }

  async uploadFiles(files: File[]) {
    try {
      return await this.fileClient.uploadFiles(files);
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error("Upload failed: file in use, folder paste not supported, or connection lost.");
      }
      handleError(error, 'Failed to upload file');
    }
  }

  async cloneFiles(filenames: string[]): Promise<string[]> {
    try {
      return await this.fileClient.cloneFiles(filenames);
    } catch (error) {
      handleError(error, 'Failed to clone files');
    }
  }

  async fetchFiles(): Promise<string[]> {
    try {
      return await this.fileClient.fetchFiles();
    } catch (error) {
      handleError(error, 'Failed to fetch files');
    }
  }

  async deleteFiles(filenames: string[]): Promise<void> {
    try {
      await this.fileClient.deleteFiles(filenames);
    } catch (error) {
      handleError(error, 'Failed to delete files');
    }
  }

  // Filter to server-hosted files and clone them
  async cloneFileUrls(fileUrls: string[]): Promise<Map<string, string>> {
    const storageUrl = await this.getStorageUrl();
    const storageFilenames = await this.getStorageFilenamesFromUrls(fileUrls);

    let urlMapping = new Map();
    if (storageFilenames.length > 0) {
      const clonedUrls = await this.cloneFiles(storageFilenames);
      storageFilenames.forEach((filename, idx) => {
        const storageFileUrl = fileUrls.find(
          fileUrl => FileLogic.getStorageFilenameFromUrl(fileUrl, storageUrl) === filename
        );
        if (storageFileUrl) {
          urlMapping.set(storageFileUrl, clonedUrls[idx]);
        }
      });
    }

    return urlMapping;
  }
}
