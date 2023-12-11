import axios from "axios";

export class MessageService {
  async sendMessage(username, content) {
    await axios.post("/api/message", {
      data: { username, content }
    });
  }

  async fetchMessages() {
    const res = await axios.get("/api/message");
    return res.data;
  }

  async deleteMessages() {
    await axios.delete("/api/message");
  }
}
