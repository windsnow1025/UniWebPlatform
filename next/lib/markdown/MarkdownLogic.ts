import MarkdownClient from "./MarkdownClient";
import {handleError} from "@/lib/common/ErrorHandler";
import {MarkdownResDto} from "@/client";

export default class MarkdownLogic {
  private markdownService: MarkdownClient;

  constructor() {
    this.markdownService = new MarkdownClient();
  }

  getTitleFromContent(content: string) {
    return content.split('\n')[0].replace('# ', '');
  }

  async fetchMarkdowns(): Promise<MarkdownResDto[]> {
    try {
      return await this.markdownService.fetchMarkdowns();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch markdowns');
    }
  }

  async fetchMarkdown(id: number): Promise<MarkdownResDto> {
    try {
      return await this.markdownService.fetchMarkdown(id);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch markdown');
    }
  }

  async addMarkdown(title: string, content: string): Promise<MarkdownResDto> {
    try {
      return await this.markdownService.addMarkdown({title, content});
    } catch (error) {
      handleError(error, 'Failed to add markdown');
    }
  }

  async updateMarkdown(id: number, title: string, content: string): Promise<MarkdownResDto> {
    try {
      return await this.markdownService.updateMarkdown(id, {title, content});
    } catch (error) {
      handleError(error, 'Failed to update markdown');
    }
  }

  async deleteMarkdown(id: number) {
    try {
      await this.markdownService.deleteMarkdown(id);
    } catch (error) {
      handleError(error, 'Failed to delete markdown');
    }
  }
}
