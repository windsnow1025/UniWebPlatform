import axios from 'axios';
import {handleError} from "@/lib/common/ErrorHandler";

export default class PublicClient {
  async fetchMarkdown(filename: string): Promise<string> {
    try {
      const response = await axios.get(`/api/fetchMarkdown?filename=${encodeURIComponent(filename)}`);
      return response.data.content;
    } catch (error) {
      handleError(error, 'Failed to fetch markdown file');
    }
  }
}