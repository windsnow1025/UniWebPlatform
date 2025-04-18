import axios from 'axios';

export default class PublicClient {
  async fetchMarkdown(filename: string): Promise<string> {
    try {
      const response = await axios.get(`/api/fetchMarkdown?filename=${encodeURIComponent(filename)}`);
      return response.data.content;
    } catch (error) {
      console.error('Error fetching markdown:', error);
      throw new Error('Failed to fetch markdown file');
    }
  }
}