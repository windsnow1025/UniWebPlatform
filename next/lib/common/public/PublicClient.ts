import {handleError} from "@/lib/common/ErrorHandler";

export default class PublicClient {
  async fetchMarkdown(filename: string): Promise<string> {
    try {
      const response = await fetch(`/${encodeURIComponent(filename)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      handleError(error, 'Failed to fetch markdown file');
    }
  }
}