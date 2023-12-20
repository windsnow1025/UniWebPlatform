import axios from 'axios';
import {Conversation} from '../model/Conversation.ts';

export default class ConversationService {
  async fetchConversations(): Promise<Conversation[]> {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/conversation/', {
      headers: {
        Authorization: token
      }
    });
    return res.data;
  }

  async addConversation(name, conversation: Conversation) {
    const token = localStorage.getItem('token');
    await axios.post("/api/conversation/", {
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
    await axios.put(`/api/conversation/`, {
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
    await axios.put(`/api/conversation/name`, {
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
    await axios.delete(`/api/conversation/${id}`, {
      headers: {
        Authorization: token
      }
    });
  }
}