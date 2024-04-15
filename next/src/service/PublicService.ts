import axios from 'axios';

export default class PublicService {
  async fetchMarkdown(filename: string): Promise<string> {
    const response = await axios.get(`/markdown/${filename}`);
    return response.data;
  }
}