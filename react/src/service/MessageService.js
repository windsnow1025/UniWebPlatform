import axios from "axios";

export default class MessageService {

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.REACT_APP_NODE_API_BASE_URL });
  }

  async sendMessage(username, content) {
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
