import axios, {AxiosInstance} from "axios";

export default class MessageService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async sendMessage(username: string, content: string) {
    await this.axiosInstance.post("/message", {
      username: username,
      content: content
    });
  }

  async fetchMessages() {
    const res = await this.axiosInstance.get("/message");
    return res.data;
  }

  async deleteMessages() {
    await this.axiosInstance.delete("/message");
  }
}
