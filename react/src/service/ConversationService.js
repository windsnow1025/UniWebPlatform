import axios from 'axios';
import {Conversation} from '../model/Conversation.ts';

export default class ConversationService {
  constructor() {
    this.axiosInstance = axios.create({ baseURL: global.apiBaseUrl });
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

  async addConversation(name, conversation: Conversation) {
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

  async updateConversation(name, conversation: Conversation, id) {
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

  async updateConversationName(name, id) {
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

  async deleteConversation(id) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/conversation/${id}`, {
      headers: {
        Authorization: token
      }
    });
  }
}