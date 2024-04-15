import MarkdownService from "../service/MarkdownService";

export class MarkdownLogic {
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
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

  async updateMarkdown(id: number, title: string, content: string) {
    try {
      await this.markdownService.updateMarkdown(id, { title, content });
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

  async deleteMarkdown(id: number) {
    try {
      await this.markdownService.deleteMarkdown(id);
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

  getTitleFromContent(content: string) {
    return content.split('\n')[0].replace('# ', '');
  }
}
