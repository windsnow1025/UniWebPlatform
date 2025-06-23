import axios from "axios";
import ConversationClient from "./ConversationClient";
import {ConversationReqDto, ConversationResDto} from "@/client";

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

  async fetchConversation(id: number): Promise<ConversationResDto> {
    try {
      return await this.conversationService.fetchConversation(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to fetch conversation');
    }
  }

  async addConversation(conversation: ConversationReqDto): Promise<ConversationResDto> {
    try {
      return await this.conversationService.addConversation(conversation);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to add conversation');
    }
  }

  async addConversationForUser(
    id: number, username: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.cloneConversationForUser(id, username);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to add conversation for user');
    }
  }

  async updateConversation(
    id: number, conversation: ConversationReqDto
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversation(id, conversation);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to update conversation');
    }
  }

  async updateConversationName(id: number, name: string): Promise<ConversationResDto> {
    try {
      return this.conversationService.updateConversationName(id, name);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to update conversation name');
    }
  }

  async addUserToConversation(id: number, username: string) {
    try {
      await this.conversationService.addUserToConversation(id, username);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to share conversation');
    }
  }

  async deleteConversation(id: number) {
    try {
      await this.conversationService.deleteConversation(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error('Failed to delete conversation');
    }
  }
}
