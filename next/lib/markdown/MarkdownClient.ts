import {getOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {MarkdownReqDto, MarkdownResDto, MarkdownsApi} from "@/client";

export default class MarkdownClient {
  async fetchMarkdowns(): Promise<MarkdownResDto[]> {
    const api = new MarkdownsApi(getOpenAPIConfiguration());
    const res = await api.markdownsControllerFindAll();
    return res.data;
  }

  async fetchMarkdown(id: number): Promise<MarkdownResDto> {
    const api = new MarkdownsApi(getOpenAPIConfiguration());
    const res = await api.markdownsControllerFindOne(id);
    return res.data;
  }

  async addMarkdown(markdown: MarkdownReqDto): Promise<MarkdownResDto> {
    const api = new MarkdownsApi(getOpenAPIConfiguration());
    const res = await api.markdownsControllerCreate(markdown);
    return res.data;
  }

  async updateMarkdown(id: number, markdown: MarkdownReqDto): Promise<MarkdownResDto> {
    const api = new MarkdownsApi(getOpenAPIConfiguration());
    const res = await api.markdownsControllerUpdate(id, markdown);
    return res.data;
  }

  async deleteMarkdown(id: number): Promise<void> {
    const api = new MarkdownsApi(getOpenAPIConfiguration());
    await api.markdownsControllerDelete(id);
  }
}
