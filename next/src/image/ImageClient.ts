import axios, {AxiosInstance} from 'axios';

export default class ImageClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({baseURL: process.env.NEXT_PUBLIC_FASTAPI_API_BASE_URL});
  }

  async generate(
    prompt: string,
    model: string,
    size: string,
    quality: string,
    n: number
  ): Promise<string[]> {
    const token = localStorage.getItem('token')!;

    const requestData = {
      prompt: prompt,
      model: model,
      size: size,
      quality: quality,
      n: n
    }

    const res = await this.axiosInstance.post('/image-gen', requestData, {
      headers: {Authorization: token}
    });
    return res.data;
  }

}
