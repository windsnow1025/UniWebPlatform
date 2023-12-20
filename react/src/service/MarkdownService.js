import axios from 'axios';

export default class MarkdownService {

  async fetchMarkdowns() {
    const res = await axios.get('/api/markdown/');
    return res.data;
  }

  async fetchMarkdown(id) {
    const res = await axios.get('/api/markdown/' + id);
    return res.data;
  }

  async addMarkdown(markdown) {
    const token = localStorage.getItem('token');
    await axios.post('/api/markdown/', markdown, {
      headers: {Authorization: token}
    });
  }

  async updateMarkdown(id, markdown) {
    const token = localStorage.getItem('token');
    await axios.put('/api/markdown/', {
      id: id,
      title: markdown.title,
      content: markdown.content
    }, {
      headers: {Authorization: token}
    });
  }

  async deleteMarkdown(id) {
    const token = localStorage.getItem('token');
    await axios.delete('/api/markdown/' + id, {
      headers: {Authorization: token}
    });
  }
}
