import {AxiosProgressEvent} from 'axios';
import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class FileClient {
  async uploadFiles(files: File[], onProgress?: (progressEvent: AxiosProgressEvent) => void): Promise<string[]> {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await getNestAxiosInstance().post("/files", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: onProgress,
    });

    return response.data.urls;
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
