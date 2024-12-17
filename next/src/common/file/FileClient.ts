import axios, {AxiosProgressEvent} from 'axios';

export default class FileClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_NEST_API_BASE_URL!;
  }

  async upload(file: File, onProgress?: (progressEvent: AxiosProgressEvent) => void): Promise<string> {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${this.baseUrl}/files/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: onProgress,
    });

    return response.data.url;
  }
}
