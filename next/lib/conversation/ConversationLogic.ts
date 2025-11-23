import {handleError} from "@/lib/common/ErrorHandler";
import ConversationClient from "./ConversationClient";
import {ConversationReqDto, ConversationResDto, ConversationUpdateTimeResDto} from "@/client";

export default class ConversationLogic {
  private conversationService: ConversationClient;

  constructor() {
    this.conversationService = new ConversationClient();
  }

  async fetchConversations(): Promise<ConversationResDto[]> {
    try {
      const conversations = await this.conversationService.fetchConversations();
      return conversations.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch conversations');
    }
  }

  async fetchConversationUpdatedTimes(): Promise<ConversationUpdateTimeResDto[]> {
    try {
      const updatedTimes = await this.conversationService.fetchConversationUpdatedTimes();
      return updatedTimes.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      handleError(error, 'Failed to fetch conversation updated times');
    }
  }

  async fetchConversation(id: number): Promise<ConversationResDto> {
    try {
      return await this.conversationService.fetchConversation(id);
    } catch (error) {
      handleError(error, 'Failed to fetch conversation');
    }
  }

  async fetchPublicConversation(id: number): Promise<ConversationResDto> {
    try {
      return await this.conversationService.fetchPublicConversation(id);
    } catch (error) {
      handleError(error, 'Failed to fetch public conversation');
    }
  }

  async addConversation(conversation: ConversationReqDto): Promise<ConversationResDto> {
    try {
      return await this.conversationService.addConversation(conversation);
    } catch (error) {
      handleError(error, 'Failed to add conversation');
    }
  }

  async cloneConversationForUser(
    id: number, username: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.cloneConversationForUser(id, username);
    } catch (error) {
      handleError(error, 'Failed to add conversation for user');
    }
  }

  async updateConversation(
    id: number, etag: string, conversation: ConversationReqDto
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversation(id, etag, conversation);
    } catch (error) {
      handleError(error, 'Failed to update conversation');
    }
  }

  async updateConversationName(
    id: number, etag: string, name: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversationName(id, etag, name);
    } catch (error) {
      handleError(error, 'Failed to update conversation name');
    }
  }

  async updateConversationPublic(
    id: number, etag: string, isPublic: boolean
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversationPublic(id, etag, isPublic);
    } catch (error) {
      handleError(error, 'Failed to update conversation public status');
    }
  }

  async updateConversationColorLabel(
    id: number, etag: string, colorLabel: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversationColorLabel(id, etag, colorLabel);
    } catch (error) {
      handleError(error, 'Failed to update conversation color label');
    }
  }

  async addUserToConversation(
    id: number, etag: string, username: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.addUserToConversation(id, etag, username);
    } catch (error) {
      handleError(error, 'Failed to share conversation');
    }
  }

  async deleteConversation(id: number) {
    try {
      await this.conversationService.deleteConversation(id);
    } catch (error) {
      handleError(error, 'Failed to delete conversation');
    }
  }
}
