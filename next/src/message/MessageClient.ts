import axios, {AxiosInstance} from "axios";

export default class MessageClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async fetchMessages() {
    const res = await this.axiosInstance.get("/messages");
    return res.data;
  }

  async sendMessage(username: string, content: string) {
    await this.axiosInstance.post("/messages/message", {
      username: username,
      content: content
    });
  }

  async deleteMessages() {
    await this.axiosInstance.delete("/messages");
  }
}
