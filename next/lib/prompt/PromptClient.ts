import {getNestOpenAPIConfiguration} from '@/lib/common/APIConfig';
import {PromptReqDto, PromptResDto, PromptsApi} from '@/client/nest';

export default class PromptClient {
  async fetchPrompts(): Promise<PromptResDto[]> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerFind();
    return res.data;
  }

  async fetchPrompt(id: number): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerFindOne(id);
    return res.data;
  }

  async savePrompt(
    prompt: PromptReqDto
  ): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerCreate(prompt);
    return res.data;
  }

  async updatePrompt(
    id: number,
    etag: string,
    prompt: PromptReqDto
  ): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerUpdate(id, etag, prompt);
    return res.data;
  }

  async updatePromptName(
    id: number,
    etag: string,
    name: string
  ): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerUpdateName(id, etag, {name});
    return res.data;
  }

  async deletePrompt(id: number): Promise<PromptResDto> {
    const api = new PromptsApi(getNestOpenAPIConfiguration());
    const res = await api.promptsControllerDelete(id);
    return res.data;
  }
}
