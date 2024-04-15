import axios, {AxiosInstance} from 'axios';
import {Conversation} from '../model/Conversation';

export default class ConversationService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NODE_API_BASE_URL });
  }

  async fetchConversations(): Promise<Conversation[]> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get('/conversation/', {
      headers: {
        Authorization: token
      }
    });
    return res.data;
  }

  async addConversation(name: string, conversation: string) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post("/conversation/", {
      name: name,
      conversation: conversation
    }, {
      headers: {
        Authorization: token
      }
    });
  }

  async updateConversation(name: string, conversation: string, id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/conversation/`, {
      name: name,
      conversation: conversation,
      id: id
    }, {
      headers: {
        Authorization: token
      }
    });
  }

  async updateConversationName(name: string, id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.put(`/conversation/name`, {
      name: name,
      id: id
    }, {
      headers: {
        Authorization: token
      }
    });
  }

  async deleteConversation(id: number) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/conversation/${id}`, {
      headers: {
        Authorization: token
      }
    });
  }
}