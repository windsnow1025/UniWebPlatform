import axios, {AxiosInstance} from 'axios';
import {Conversation} from '../model/Conversation';

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

  async addConversation(conversation: Conversation) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post("/conversations/conversation", conversation, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async updateConversation(conversation: Conversation) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put('/conversations/conversation', conversation, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }

  async deleteConversation(id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/conversations/conversation/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}