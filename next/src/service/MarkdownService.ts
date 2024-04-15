import axios, {AxiosInstance} from 'axios';
import {Markdown} from "@/src/model/Markdown";

export default class MarkdownService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NODE_API_BASE_URL });
  }

  async fetchMarkdowns(): Promise<Markdown[]> {
    const res = await this.axiosInstance.get('/markdown/');
    return res.data;
  }

  async fetchMarkdown(id: number): Promise<Markdown> {
    const res = await this.axiosInstance.get('/markdown/' + id);
    return res.data;
  }

  async addMarkdown(markdown: Markdown) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post('/markdown/', markdown, {
      headers: {Authorization: token}
    });
  }

  async updateMarkdown(id: number, markdown: Markdown) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put('/markdown/', {
      id: id,
      title: markdown.title,
      content: markdown.content
    }, {
      headers: {Authorization: token}
    });
  }

  async deleteMarkdown(id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete('/markdown/' + id, {
      headers: {Authorization: token}
    });
  }
}
