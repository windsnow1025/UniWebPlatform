import {handleError} from '@/lib/common/ErrorHandler';
import PromptClient from './PromptClient';
import {PromptReqDto, PromptResDto} from '@/client/nest';

export default class PromptLogic {
  private promptClient: PromptClient;

  constructor() {
    this.promptClient = new PromptClient();
  }

  async fetchPrompts(): Promise<PromptResDto[]> {
    try {
      return await this.promptClient.fetchPrompts();
    } catch (error) {
      handleError(error, 'Failed to fetch prompts');
    }
  }

  async fetchPrompt(id: number): Promise<PromptResDto> {
    try {
      return await this.promptClient.fetchPrompt(id);
    } catch (error) {
      handleError(error, 'Failed to fetch prompt');
    }
  }

  async savePrompt(
    prompt: PromptReqDto
  ): Promise<PromptResDto> {
    try {
      return await this.promptClient.savePrompt(prompt);
    } catch (error) {
      handleError(error, 'Failed to add prompt');
    }
  }

  async updatePrompt(
    id: number,
    etag: string,
    prompt: PromptReqDto
  ): Promise<PromptResDto> {
    try {
      return await this.promptClient.updatePrompt(
        id,
        etag,
        prompt
      );
    } catch (error) {
      handleError(error, 'Failed to update prompt');
    }
  }

  async updatePromptName(
    id: number,
    etag: string,
    name: string
  ): Promise<PromptResDto> {
    try {
      return await this.promptClient.updatePromptName(
        id,
        etag,
        name
      );
    } catch (error) {
      handleError(error, 'Failed to update prompt name');
    }
  }

  async deletePrompt(id: number): Promise<PromptResDto> {
    try {
      return await this.promptClient.deletePrompt(id);
    } catch (error) {
      handleError(error, 'Failed to delete prompt');
    }
  }
}
