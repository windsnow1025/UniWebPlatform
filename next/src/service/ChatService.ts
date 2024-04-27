import axios, {AxiosInstance} from 'axios';
import {Message} from '../model/Message'

export interface StreamResponse {
  reader: ReadableStreamDefaultReader;
  controller: AbortController;
}

export default class ChatService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_FAST_API_BASE_URL });
  }

  async generate(
      messages: Message[],
      api_type: string,
      model: string,
      temperature: number,
      stream: boolean
  ): Promise<string | StreamResponse> {
    const token = localStorage.getItem('token')!;

    const requestData = {
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: stream
    }

    if (!stream) {
      const res = await this.axiosInstance.post(`/chat`, requestData, {
          headers: {
            Authorization: token
          }
        }
      );

      return res.data;
    } else {
      const controller = new AbortController();
      const response = await fetch(`${process.env.NEXT_PUBLIC_FAST_API_BASE_URL}/chat`, {
        method: "POST",
        body: JSON.stringify(requestData),
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const reader = response.body!.getReader();
      return {
        reader,
        controller
      };
    }
  }

  async fetchModels(): Promise<string[]> {
    const res = await this.axiosInstance.get(`/chat`);
    return res.data;
  }
}
