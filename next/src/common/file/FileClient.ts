import {AxiosProgressEvent} from 'axios';
import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class FileClient {
  async upload(file: File, onProgress?: (progressEvent: AxiosProgressEvent) => void): Promise<string> {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', file);

    const response = await getNestAxiosInstance().post("/files/file", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: onProgress,
    });

    return response.data.url;
  }

  async fetchFiles(): Promise<string[]> {
    const token = localStorage.getItem('token');

    const response = await getNestAxiosInstance().get("/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.urls;
  }

  async deleteFiles(filenames: string[]): Promise<void> {
    const token = localStorage.getItem('token');

    await getNestAxiosInstance().delete("/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        filenames: filenames,
      },
    });
  }
}
