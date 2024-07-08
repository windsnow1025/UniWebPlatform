import axios, { AxiosProgressEvent } from 'axios';

export default class FileService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_NEST_API_BASE_URL!;
  }

  async upload(file: File, onProgress?: (progressEvent: AxiosProgressEvent) => void): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${this.baseUrl}/files/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      });

      return response.data.url;
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
