import {getNestOpenAPIConfiguration} from '@/lib/common/APIConfig';
import {PromptReqDto, PromptResDto, PromptsApi} from '@/client/nest';

export default class PromptClient {
  async fetchSystemPrompts(): Promise<PromptResDto[]> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerFind();
    return res.data;
  }

  async fetchSystemPrompt(id: number): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerFindOne(id);
    return res.data;
  }

  async saveSystemPrompt(
    systemPrompt: PromptReqDto
  ): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerCreate(systemPrompt);
    return res.data;
  }

  async updateSystemPrompt(
    id: number,
    etag: string,
    systemPrompt: PromptReqDto
  ): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerUpdate(id, etag, systemPrompt);
    return res.data;
  }

  async updateSystemPromptName(
    id: number,
    etag: string,
    name: string
  ): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerUpdateName(id, etag, {name});
    return res.data;
  }

  async deleteSystemPrompt(id: number): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerDelete(id);
    return res.data;
  }
}
