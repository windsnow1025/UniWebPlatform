import FileClient from "./FileClient";
import axios, {AxiosProgressEvent} from "axios";

export default class FileLogic {
  private fileService: FileClient;

  constructor() {
    this.fileService = new FileClient();
  }

  async upload(file: File, onProgress?: (progressEvent: AxiosProgressEvent) => void) {
    try {
      return await this.fileService.upload(file, onProgress);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 413) {
          throw new Error('File is too large');
        }
      }
      console.error(error);
      throw new Error('Failed to upload file');
    }
  }
}
