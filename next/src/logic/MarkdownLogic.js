import MarkdownService from "../service/MarkdownService.ts";

export class MarkdownLogic {
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

  async fetchMarkdown(id) {
    try {
      return await this.markdownService.fetchMarkdown(id);
    } catch (error) {
      console.error(error);
    }
  }

  async addMarkdown(title, content) {
    try {
      await this.markdownService.addMarkdown({ title, content });
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(error);
        throw new Error('Unknown Error');
      }
    }
  }

  async updateMarkdown(id, title, content) {
    try {
      await this.markdownService.updateMarkdown(id, { title, content });
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(error);
        throw new Error('Unknown Error');
      }
    }
  }

  async deleteMarkdown(id) {
    try {
      await this.markdownService.deleteMarkdown(id);
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(error);
        throw new Error('Unknown Error');
      }
    }
  }

  getTitleFromContent(content) {
    return content.split('\n')[0].replace('# ', '');
  }
}
