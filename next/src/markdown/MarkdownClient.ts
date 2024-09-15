import axios, {AxiosInstance} from 'axios';
import {Markdown} from "@/src/markdown/Markdown";

export default class MarkdownClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async fetchMarkdowns(): Promise<Markdown[]> {
    const res = await this.axiosInstance.get('/markdowns');
    return res.data;
  }

  async fetchMarkdown(id: number): Promise<Markdown> {
    const res = await this.axiosInstance.get('/markdowns/markdown/' + id);
    return res.data;
  }

  async addMarkdown(markdown: Markdown) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post('/markdowns/markdown', markdown, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateMarkdown(id: number, markdown: Markdown) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put('/markdowns/markdown', {
      id: id,
      title: markdown.title,
      content: markdown.content
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteMarkdown(id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/markdowns/markdown/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}
