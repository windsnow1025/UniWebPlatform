import axios, {AxiosProgressEvent} from 'axios';
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
}
