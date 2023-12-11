import axios from 'axios';

export default class MarkdownService {

  async fetchMarkdown(id) {
    const res = await axios.get('/api/markdown/' + id);
    return res.data;
  }

  async addMarkdown(markdown) {
    const token = localStorage.getItem('token');
    await axios.post('/api/markdown/', {data: markdown}, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateMarkdown(id, markdown) {
    const token = localStorage.getItem('token');
    await axios.put('/api/markdown/', {
      data: {
        id: id,
        title: markdown.title,
        content: markdown.content
      }
    }, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteMarkdown(id) {
    const token = localStorage.getItem('token');
    await axios.delete('/api/markdown/' + id, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}
