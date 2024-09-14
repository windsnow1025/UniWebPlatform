import axios, {AxiosInstance} from 'axios';
import {Conversation} from './Conversation';

export default class ConversationService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async fetchConversations(): Promise<Conversation[]> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get('/conversations', {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async addConversation(conversation: Conversation): Promise<Conversation> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.post("/conversations/conversation", conversation, {
      headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
  }

  async addUserToConversation(id: number, username: string) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post(`/conversations/conversation/${id}/user`, { username }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async updateConversation(conversation: Conversation) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put('/conversations/conversation', conversation, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateConversationName(id: number, name: string): Promise<Conversation> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.patch(`/conversations/conversation/${id}/name`, { name }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async deleteConversation(id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/conversations/conversation/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}