import {Conversation} from './Conversation';
import {getNestAxiosInstance} from "@/src/common/APIConfig";

export default class ConversationClient {
  async fetchConversations(): Promise<Conversation[]> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().get('/conversations', {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async addConversation(conversation: Conversation): Promise<Conversation> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().post("/conversations/conversation", conversation, {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async addConversationForUser(id: number, username: string): Promise<Conversation> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().post(`/conversations/conversation/${id}/user`, {username}, {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async updateConversation(conversation: Conversation): Promise<Conversation> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().put('/conversations/conversation', conversation, {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async updateConversationName(id: number, name: string): Promise<Conversation> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().patch(`/conversations/conversation/${id}/name`, {name}, {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async addUserToConversation(id: number, username: string) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().patch(`/conversations/conversation/${id}/users`, {username}, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteConversation(id: number) {
    const token = localStorage.getItem('token');
    await getNestAxiosInstance().delete(`/conversations/conversation/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}