import {getOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {
  ConversationReqDto,
  ConversationResDto,
  ConversationsApi
} from "@/client";

export default class ConversationClient {
  async fetchConversations(): Promise<ConversationResDto[]> {
    const api = new ConversationsApi(getOpenAPIConfiguration());
    const res = await api.conversationsControllerFind();
    return res.data;
  }

  async addConversation(conversation: ConversationReqDto): Promise<ConversationResDto> {
    const api = new ConversationsApi(getOpenAPIConfiguration());
    const res = await api.conversationsControllerCreate(
      conversation
    );
    return res.data;
  }

  async cloneConversationForUser(id: number, username: string): Promise<ConversationResDto> {
    const api = new ConversationsApi(getOpenAPIConfiguration());
    const res = await api.conversationsControllerCloneForSpecificUser(
      id, {username}
    );
    return res.data;
  }

  async addUserToConversation(id: number, username: string): Promise<ConversationResDto> {
    const api = new ConversationsApi(getOpenAPIConfiguration());
    const res = await api.conversationsControllerAddUserForUsers(
      id, {username}
    );
    return res.data;
  }

  async updateConversation(id: number, conversation: ConversationReqDto): Promise<ConversationResDto> {
    const api = new ConversationsApi(getOpenAPIConfiguration());
    const res = await api.conversationsControllerUpdate(
      id, conversation
    );
    return res.data;
  }

  async updateConversationName(id: number, name: string): Promise<ConversationResDto> {
    const api = new ConversationsApi(getOpenAPIConfiguration());
    const res = await api.conversationsControllerUpdateName(
      id, {name},
    );
    return res.data;
  }

  async deleteConversation(id: number): Promise<void> {
    const api = new ConversationsApi(getOpenAPIConfiguration());
    await api.conversationsControllerDelete(id);
  }
}