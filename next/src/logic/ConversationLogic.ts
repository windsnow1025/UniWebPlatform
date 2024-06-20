import ConversationService from "../service/ConversationService";
import {Conversation} from "../model/Conversation";

export class ConversationLogic {
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

  async addConversation(conversation: Conversation) {
    try {
      await this.conversationService.addConversation(conversation);
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

  async updateConversation(conversation: Conversation) {
    try {
      await this.conversationService.updateConversation(conversation);
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

  async deleteConversation(id: number) {
    try {
      await this.conversationService.deleteConversation(id);
    } catch (err: any) {
      if (err.response.status === 401) {
        throw new Error('Unauthorized');
      } else if (err.response.status === 403) {
        throw new Error('Forbidden');
      } else {
        console.error(err);
        throw new Error('Unknown Error');
      }
    }
  }

}