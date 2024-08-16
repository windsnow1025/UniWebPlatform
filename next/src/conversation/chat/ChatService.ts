import axios, {AxiosInstance} from 'axios';
import {Message} from './Message'
import {ApiTypeModel} from "./Chat";

export interface StreamResponse {
  reader: ReadableStreamDefaultReader;
  controller: AbortController;
}

export default class ChatService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_FASTAPI_API_BASE_URL });
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_API_BASE_URL}/chat`, {
        method: "POST",
        body: JSON.stringify(requestData),
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        let errorDetail: string;

        try {
          const error = await response.json();
          errorDetail = error.detail;
        } catch (e) {
          errorDetail = await response.text();
          if (!errorDetail) {
            errorDetail = `Unable to parse response: ${response}`;
          }
        }

        throw new Error(errorDetail);
      }

      const reader = response.body!.getReader();
      return {
        reader,
        controller
      };
    }
  }

  async fetchApiModels(): Promise<ApiTypeModel[]> {
    const res = await this.axiosInstance.get(`/chat`);
    return res.data;
  }
}
