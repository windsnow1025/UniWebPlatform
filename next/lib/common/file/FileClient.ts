import {getNestAxiosInstance, getOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {FilesApi} from "@/client";

export default class FileClient {
  async uploadFiles(files: File[]): Promise<string[]> {
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
    });

    return response.data.urls;
  }

  async getStorageUrl(): Promise<string> {
    const api = new FilesApi(getOpenAPIConfiguration());
    const response = await api.filesControllerGetMinioWebUrl();
    return response.data.webUrl;
  }

  async cloneFiles(filenames: string[]): Promise<string[]> {
    const api = new FilesApi(getOpenAPIConfiguration());
    const response = await api.filesControllerCloneFiles({
      filenames: filenames
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
