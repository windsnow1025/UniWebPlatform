import axios from 'axios';
import {Conversation} from '../model/Conversation.ts';

export default class ConversationService {
  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NODE_API_BASE_URL });
  }

  /**
   * @returns {Promise<Conversation[]>}
   */
  async fetchConversations() {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get('/conversation/', {
      headers: {
        Authorization: token
      }
    });
    return res.data;
  }

  /**
   * @param {string} name
   * @param {Conversation} conversation
   */
  async addConversation(name, conversation) {
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

  /**
   * @param {string} name
   * @param {Conversation} conversation
   * @param {string} id
   */
  async updateConversation(name, conversation, id) {
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

  /**
   * @param {string} name
   * @param {string} id
   */
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

  /**
   * @param {string} id
   */
  async deleteConversation(id) {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/conversation/${id}`, {
      headers: {
        Authorization: token
      }
    });
  }
}