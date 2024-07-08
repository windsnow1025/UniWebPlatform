import MarkdownService from "../service/MarkdownService";
import axios from "axios";

export default class MarkdownLogic {
  private markdownService: MarkdownService;

  constructor() {
    this.markdownService = new MarkdownService();
  }

  async fetchMarkdowns() {
    try {
      return await this.markdownService.fetchMarkdowns();
    } catch (error) {
      console.error(error);
    }
  }

  async fetchMarkdown(id: number) {
    try {
      return await this.markdownService.fetchMarkdown(id);
    } catch (error) {
      console.error(error);
    }
  }

  async addMarkdown(title: string, content: string) {
    try {
      await this.markdownService.addMarkdown({ title, content });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to add markdown');
    }
  }

  async updateMarkdown(id: number, title: string, content: string) {
    try {
      await this.markdownService.updateMarkdown(id, { title, content });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to update markdown');
    }
  }

  async deleteMarkdown(id: number) {
    try {
      await this.markdownService.deleteMarkdown(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to delete markdown');
    }
  }

  getTitleFromContent(content: string) {
    return content.split('\n')[0].replace('# ', '');
  }
}
