import {AxiosProgressEvent} from 'axios';
import {getNestAxiosInstance, getOpenAPIConfiguration} from "@/src/common/APIConfig";
import {FilesApi} from "@/client";

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
    const api = new FilesApi(getOpenAPIConfiguration());
    const response = await api.filesControllerGetFiles();
    return response.data.urls;
  }

  async deleteFiles(filenames: string[]): Promise<void> {
    const api = new FilesApi(getOpenAPIConfiguration());
    await api.filesControllerDeleteFiles({
      filenames: filenames
    });
  }
}
