import axios from 'axios';
import { Conversation } from '../model/Conversation.ts';

export default class ConversationService {
  async fetchConversations(): Promise<Conversation[]> {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/conversation/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  }

  async addConversation(name, conversation: Conversation) {
    const token = localStorage.getItem('token');
    await axios.post("/api/conversation/", {
      data: {
        name: name,
        conversation: conversation
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async updateConversation(name, conversation: Conversation, id) {
    const token = localStorage.getItem('token');
    await axios.put(`/api/conversation/`, {
      data: {
        name: name,
        conversation: conversation,
        id: id
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async updateConversationName(name, id) {
    const token = localStorage.getItem('token');
    await axios.put(`/api/conversation/name`, {
      data: {
        name: name,
        id: id
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async deleteConversation(id) {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/conversation/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}