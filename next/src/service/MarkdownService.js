import axios from 'axios';

export default class MarkdownService {

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NODE_API_BASE_URL });
  }

  async fetchMarkdowns() {
    const res = await this.axiosInstance.get('/markdown/');
    return res.data;
  }

  async fetchMarkdown(id) {
    const res = await this.axiosInstance.get('/markdown/' + id);
    return res.data;
  }

  async addMarkdown(markdown) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post('/markdown/', markdown, {
      headers: {Authorization: token}
    });
  }

  async updateMarkdown(id, markdown) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put('/markdown/', {
      id: id,
      title: markdown.title,
      content: markdown.content
    }, {
      headers: {Authorization: token}
    });
  }

  async deleteMarkdown(id) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete('/markdown/' + id, {
      headers: {Authorization: token}
    });
  }
}
