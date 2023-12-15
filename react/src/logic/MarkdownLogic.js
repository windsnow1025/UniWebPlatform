import MarkdownService from "../service/MarkdownService";

export class MarkdownLogic {
  constructor() {
    this.markdownService = new MarkdownService();
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
      alert('Add Success!');
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      } else {
        console.error(error);
      }
    }
  }

  async updateMarkdown(id, title, content) {
    try {
      await this.markdownService.updateMarkdown(id, { title, content });
      alert('Update Success!');
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      } else {
        console.error(error);
      }
    }
  }

  async deleteMarkdown(id) {
    try {
      await this.markdownService.deleteMarkdown(id);
      alert('Delete Success!');
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      } else {
        console.error(error);
      }
    }
  }

  getTitleFromContent(content) {
    return content.split('\n')[0].replace('# ', '');
  }
}
