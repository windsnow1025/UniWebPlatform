import axios from "axios";
import ConversationClient from "./ConversationClient";
import {Conversation} from "./Conversation";

export default class ConversationLogic {
  private conversationService: ConversationClient;

  constructor() {
    this.conversationService = new ConversationClient();
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

  async addConversationForUser(id: number, username: string): Promise<Conversation> {
    try {
      return await this.conversationService.cloneConversationForUser(id, username);
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
      throw new Error('Failed to add conversation for user');
    }
  }

  async updateConversation(id: number,conversation: Conversation): Promise<Conversation> {
    try {
      return await this.conversationService.updateConversation(id, conversation);
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