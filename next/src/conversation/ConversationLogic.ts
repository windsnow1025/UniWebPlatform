import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import ConversationClient from "./ConversationClient";
import {Conversation} from "./Conversation";
import {Message} from "./chat/Message";

export default class ConversationLogic {
  private conversationService: ConversationClient;

  constructor() {
    this.conversationService = new ConversationClient();
  }

  // Should be removed after all data synced
  private async ensureMessageIdsAndSync(conversations: Conversation[]): Promise<Conversation[]> {
    const updatedConversations = conversations.map((conversation) => {
      const updatedMessages: Message[] = [];

      conversation.messages.forEach((message) => {
        if (!message.id) {
          updatedMessages.unshift({...message, id: uuidv4()});
        } else {
          updatedMessages.push(message);
        }
      });

      return {...conversation, messages: updatedMessages};
    });

    for (const conversation of updatedConversations) {
      try {
        await this.updateConversation(conversation);
      } catch (error) {
        console.error(`Failed to sync conversation ${conversation.id}:`, error);
      }
    }

    return updatedConversations;
  }

  async fetchConversations() {
    try {
      const conversations = await this.conversationService.fetchConversations();
      return this.ensureMessageIdsAndSync(conversations);

      // return await this.conversationService.fetchConversations();
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
      return await this.conversationService.addConversationForUser(id, username);
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