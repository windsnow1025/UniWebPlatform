import {getNestOpenAPIConfiguration} from '@/lib/common/APIConfig';
import {
  SystemPromptReqDto,
  SystemPromptResDto,
  SystemPromptsApi,
} from '@/client/nest';

export default class SystemPromptClient {
  async fetchSystemPrompts(): Promise<SystemPromptResDto[]> {
    const api = new SystemPromptsApi(getNestOpenAPIConfiguration());
    const res = await api.systemPromptsControllerFind();
    return res.data;
  }

  async fetchSystemPrompt(id: number): Promise<SystemPromptResDto> {
    const api = new SystemPromptsApi(getNestOpenAPIConfiguration());
    const res = await api.systemPromptsControllerFindOne(id);
    return res.data;
  }

  async saveSystemPrompt(
    systemPrompt: SystemPromptReqDto
  ): Promise<SystemPromptResDto> {
    const api = new SystemPromptsApi(getNestOpenAPIConfiguration());
    const res = await api.systemPromptsControllerCreate(systemPrompt);
    return res.data;
  }

  async updateSystemPrompt(
    id: number,
    etag: string,
    systemPrompt: SystemPromptReqDto
  ): Promise<SystemPromptResDto> {
    const api = new SystemPromptsApi(getNestOpenAPIConfiguration());
    const res = await api.systemPromptsControllerUpdate(id, etag, systemPrompt);
    return res.data;
  }

  async updateSystemPromptName(
    id: number,
    etag: string,
    name: string
  ): Promise<SystemPromptResDto> {
    const api = new SystemPromptsApi(getNestOpenAPIConfiguration());
    const res = await api.systemPromptsControllerUpdateName(id, etag, {name});
    return res.data;
  }

  async deleteSystemPrompt(id: number): Promise<SystemPromptResDto> {
    const api = new SystemPromptsApi(getNestOpenAPIConfiguration());
    const res = await api.systemPromptsControllerDelete(id);
    return res.data;
  }
}
