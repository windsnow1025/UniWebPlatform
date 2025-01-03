import axios, {AxiosInstance} from 'axios';

export default class AuthClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL});
  }

  async fetchToken(username: string, password: string): Promise<string> {
    const res = await this.axiosInstance.post("/auth/token", {
      username: username,
      password: password
    });
    return res.data.access_token;
  }
}
