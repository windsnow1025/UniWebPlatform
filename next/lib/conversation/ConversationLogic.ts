import {handleError} from "@/lib/common/ErrorHandler";
import ConversationClient from "./ConversationClient";
import {ConversationReqDto, ConversationResDto, ConversationUpdateTimeResDto, Message} from "@/client/nest";
import SystemPromptLogic from "@/lib/system-prompt/SystemPromptLogic";

export default class ConversationLogic {
  private conversationService: ConversationClient;

  constructor() {
    this.conversationService = new ConversationClient();
  }

  static async populateSystemPromptContents(messages: Message[]): Promise<void> {
    const systemPromptLogic = new SystemPromptLogic();
    for (const message of messages) {
      if (message.systemPromptId) {
        const systemPrompt = await systemPromptLogic.fetchSystemPrompt(message.systemPromptId);
        message.contents = systemPrompt.contents;
      }
    }
  }

  static stripSystemPromptContents(messages: Message[]): Message[] {
    return messages.map(message => {
      if (message.systemPromptId) {
        return {...message, contents: []};
      }
      return message;
    });
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = Math.max(0, now.getTime() - date.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return diffMins <= 0 ? 'Just now' : `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  async fetchConversations(): Promise<ConversationResDto[]> {
    try {
      return await this.conversationService.fetchConversations();
    } catch (err) {
      handleError(err, 'Failed to fetch conversations');
    }
  }

  async fetchConversationUpdatedTimes(): Promise<ConversationUpdateTimeResDto[]> {
    try {
      return await this.conversationService.fetchConversationUpdatedTimes();
    } catch (error) {
      handleError(error, 'Failed to fetch conversation-sidebar updated times');
    }
  }

  async fetchConversation(id: number): Promise<ConversationResDto> {
    try {
      return await this.conversationService.fetchConversation(id);
    } catch (error) {
      handleError(error, 'Failed to fetch conversation-sidebar');
    }
  }

  async fetchPublicConversation(id: number): Promise<ConversationResDto> {
    try {
      return await this.conversationService.fetchPublicConversation(id);
    } catch (error) {
      handleError(error, 'Failed to fetch public conversation-sidebar');
    }
  }

  async addConversation(conversation: ConversationReqDto): Promise<ConversationResDto> {
    try {
      return await this.conversationService.saveConversation(conversation);
    } catch (error) {
      handleError(error, 'Failed to add conversation-sidebar');
    }
  }

  async cloneConversationForUser(
    id: number, username: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.cloneConversationForUser(id, username);
    } catch (error) {
      handleError(error, 'Failed to add conversation-sidebar for user');
    }
  }

  async updateConversation(
    id: number, etag: string, conversation: ConversationReqDto
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversation(id, etag, conversation);
    } catch (error) {
      handleError(error, 'Failed to update conversation-sidebar');
    }
  }

  async updateConversationName(
    id: number, etag: string, name: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversationName(id, etag, name);
    } catch (error) {
      handleError(error, 'Failed to update conversation-sidebar name');
    }
  }

  async updateConversationPublic(
    id: number, etag: string, isPublic: boolean
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversationPublic(id, etag, isPublic);
    } catch (error) {
      handleError(error, 'Failed to update conversation-sidebar public status');
    }
  }

  async updateConversationLabelLink(
    id: number, etag: string, labelId: number | null
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.updateConversationLabelLink(id, etag, labelId);
    } catch (error) {
      handleError(error, 'Failed to update conversation-sidebar label');
    }
  }

  async addUserToConversation(
    id: number, etag: string, username: string
  ): Promise<ConversationResDto> {
    try {
      return await this.conversationService.addUserToConversation(id, etag, username);
    } catch (error) {
      handleError(error, 'Failed to share conversation-sidebar');
    }
  }

  async deleteConversation(id: number) {
    try {
      await this.conversationService.deleteConversation(id);
    } catch (error) {
      handleError(error, 'Failed to delete conversation-sidebar');
    }
  }
}
