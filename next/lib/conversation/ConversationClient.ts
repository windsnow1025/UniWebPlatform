import {getNestOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {ConversationReqDto, ConversationResDto, ConversationsApi, ConversationVersionResDto} from "@/client/nest";

export default class ConversationClient {
  async fetchConversations(ids?: number[]): Promise<ConversationResDto[]> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerFind(ids);
    return res.data;
  }

  async fetchConversation(id: number): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerFindOne(id);
    return res.data;
  }

  async fetchConversationVersions(): Promise<ConversationVersionResDto[]> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerFindVersions();
    return res.data;
  }

  async fetchPublicConversation(id: number): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerFindPublicOne(id);
    return res.data;
  }

  async saveConversation(conversation: ConversationReqDto): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerCreate(
      conversation
    );
    return res.data;
  }

  async cloneConversationForUser(id: number, username: string): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerCloneForSpecificUser(
      id, {username}
    );
    return res.data;
  }

  async addUserToConversation(id: number, etag: string, username: string): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerAddUserForUsers(
      id, etag, {username}
    );
    return res.data;
  }

  async updateConversation(id: number, etag: string, conversation: ConversationReqDto): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerUpdate(
      id, etag, conversation
    );
    return res.data;
  }

  async updateConversationName(id: number, etag: string, name: string): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerUpdateName(
      id, etag, {name},
    );
    return res.data;
  }

  async updateConversationPublic(id: number, etag: string, isPublic: boolean): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerUpdatePublic(
      id, etag, {isPublic},
    );
    return res.data;
  }

  async updateConversationLabelLink(id: number, etag: string, labelId: number | null): Promise<ConversationResDto> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    const res = await api.conversationsControllerUpdateLabelLink(
      id, etag, {labelId},
    );
    return res.data;
  }

  async deleteConversation(id: number): Promise<void> {
    const api = new ConversationsApi(getNestOpenAPIConfiguration());
    await api.conversationsControllerDelete(id);
  }
}
