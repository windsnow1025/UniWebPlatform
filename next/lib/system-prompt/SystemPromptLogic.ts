import {handleError} from '@/lib/common/ErrorHandler';
import SystemPromptClient from './SystemPromptClient';
import {SystemPromptReqDto, SystemPromptResDto} from '@/client/nest';

export default class SystemPromptLogic {
  private systemPromptClient: SystemPromptClient;

  constructor() {
    this.systemPromptClient = new SystemPromptClient();
  }

  async fetchSystemPrompts(): Promise<SystemPromptResDto[]> {
    try {
      return await this.systemPromptClient.fetchSystemPrompts();
    } catch (error) {
      handleError(error, 'Failed to fetch system prompts');
    }
  }

  async fetchSystemPrompt(id: number): Promise<SystemPromptResDto> {
    try {
      return await this.systemPromptClient.fetchSystemPrompt(id);
    } catch (error) {
      handleError(error, 'Failed to fetch system prompt');
    }
  }

  async saveSystemPrompt(
    systemPrompt: SystemPromptReqDto
  ): Promise<SystemPromptResDto> {
    try {
      return await this.systemPromptClient.saveSystemPrompt(systemPrompt);
    } catch (error) {
      handleError(error, 'Failed to add system prompt');
    }
  }

  async updateSystemPrompt(
    id: number,
    etag: string,
    systemPrompt: SystemPromptReqDto
  ): Promise<SystemPromptResDto> {
    try {
      return await this.systemPromptClient.updateSystemPrompt(
        id,
        etag,
        systemPrompt
      );
    } catch (error) {
      handleError(error, 'Failed to update system prompt');
    }
  }

  async updateSystemPromptName(
    id: number,
    etag: string,
    name: string
  ): Promise<SystemPromptResDto> {
    try {
      return await this.systemPromptClient.updateSystemPromptName(
        id,
        etag,
        name
      );
    } catch (error) {
      handleError(error, 'Failed to update system prompt name');
    }
  }

  async deleteSystemPrompt(id: number): Promise<SystemPromptResDto> {
    try {
      return await this.systemPromptClient.deleteSystemPrompt(id);
    } catch (error) {
      handleError(error, 'Failed to delete system prompt');
    }
  }
}
