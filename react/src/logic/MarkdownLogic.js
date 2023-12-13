import MarkdownService from "../service/MarkdownService";


export class MarkdownLogic {
  constructor(id) {
    this.id = id;
    this.title = "";
    this.content = "";

    this.markdownService = new MarkdownService();
  }

  async fetchMarkdown() {
    try {
      const markdown = await this.markdownService.fetchMarkdown(this.id);
      this.title = markdown.title;
      this.content = markdown.content;
    } catch (error) {
      console.log(error);
    }
  }

  async addMarkdown() {
    this.set_title_by_content();
    try {
      await this.markdownService.addMarkdown({
        title: this.title,
        content: this.content
      });
      alert('Add Success!')
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      }
    }
  }

  async updateMarkdown() {
    this.set_title_by_content();
    try {
      await this.markdownService.updateMarkdown(this.id, {
        title: this.title,
        content: this.content
      });
      alert('Update Success!')
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      }
    }
  }

  async deleteMarkdown() {
    try {
      await this.markdownService.deleteMarkdown(this.id);
      alert('Delete Success!')
    } catch (error) {
      if (error.response.status === 403) {
        alert('Unauthorized');
      }
    }
  }

  set_title_by_content() {
    this.title = this.content.split('\n')[0].replace('# ', '');
  }
}