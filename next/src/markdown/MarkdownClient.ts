import {Markdown} from "@/src/markdown/Markdown";
import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class MarkdownClient {
  async fetchMarkdowns(): Promise<Markdown[]> {
    const res = await getNestAxiosInstance().get('/markdowns');
    return res.data;
  }

  async fetchMarkdown(id: number): Promise<Markdown> {
    const res = await getNestAxiosInstance().get('/markdowns/markdown/' + id);
    return res.data;
  }

  async addMarkdown(markdown: Markdown) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().post('/markdowns/markdown', markdown, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateMarkdown(id: number, markdown: Markdown) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().put('/markdowns/markdown', {
      id: id,
      title: markdown.title,
      content: markdown.content
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteMarkdown(id: number) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().delete(`/markdowns/markdown/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}
