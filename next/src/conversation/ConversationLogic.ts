import ConversationService from "./ConversationService";
import {Conversation} from "./Conversation";
import axios from "axios";

export default class ConversationLogic {
  private conversationService: ConversationService;

  constructor() {
    this.conversationService = new ConversationService();
  }

  async fetchConversations() {
    try {
      return await this.conversationService.fetchConversations();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addConversation(conversation: Conversation): Promise<Conversation> {
    try {
      return await this.conversationService.addConversation(conversation);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to add conversation');
    }
  }

  async addUserToConversation(id: number, username: string) {
    try {
      await this.conversationService.addUserToConversation(id, username);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to share conversation');
    }
  }

  async updateConversation(conversation: Conversation) {
    try {
      await this.conversationService.updateConversation(conversation);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to update conversation');
    }
  }

  async updateConversationName(id: number, name: string) {
    try {
      return this.conversationService.updateConversationName(id, name);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to update conversation name');
    }
  }

  async deleteConversation(id: number) {
    try {
      await this.conversationService.deleteConversation(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden');
        }
      }
      console.error(error);
      throw new Error('Failed to delete conversation');
    }
  }

}