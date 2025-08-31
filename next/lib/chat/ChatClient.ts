import axios from 'axios';
import {ApiTypeModel, ChatResponse} from "./ChatResponse";
import {getAPIBaseURLs, getFastAPIAxiosInstance} from "@/lib/common/APIConfig";
import {fetchEventSource} from '@microsoft/fetch-event-source';
import {Message} from "@/client";

export default class ChatClient {
  async nonStreamGenerate(
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number
  ): Promise<ChatResponse> {
    const token = localStorage.getItem('token')!;

    const requestData = {
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: false
    };

    try {
      const res = await getFastAPIAxiosInstance().post(`/chat`, requestData, {
        headers: {
          Authorization: token
        }
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          let detail = error.response.data?.detail || error.response.statusText;
          if (status === 402) {
            detail += ", please contact windsnow1025@gmail.com";
          }
          throw new Error(`${status}: ${detail}`);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  async* streamGenerate(
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    onOpenCallback?: () => void,
  ): AsyncGenerator<ChatResponse, void, unknown> {
    const token = localStorage.getItem('token')!;

    const requestData = {
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: true
    };

    const queue: ChatResponse[] = [];
    let resolveQueue: (() => void) | null = null;
    let isDone = false;
    let errorOccurred: Error | null = null;

    fetchEventSource(`${getAPIBaseURLs().fastAPI}/chat`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      async onopen(response) {
        if (onOpenCallback) {
          onOpenCallback();
        }

        if (!response.ok) {
          const status = response.status;
          const statusText = response.statusText;
          let resJson;
          try {
            resJson = await response.json();
          } catch (error) {
            console.error(error);
          }

          let detail;
          if (resJson && resJson.detail) {
            detail = resJson.detail;
          } else {
            detail = statusText;
          }
          if (status === 402) {
            detail += ", please contact windsnow1025@gmail.com";
          }

          throw new Error(`${status}: ${detail}`);
        }
      },
      onmessage(event) {
        const parsedData = JSON.parse(event.data);
        queue.push(parsedData);
        if (resolveQueue) {
          resolveQueue();
          resolveQueue = null;
        }
      },
      onclose() {
        isDone = true;
        if (resolveQueue) {
          resolveQueue();
        }
      },
      onerror(err) {
        errorOccurred = err;
        isDone = true;
        if (resolveQueue) {
          resolveQueue();
        }
        throw err;
      }
    });

    while (!isDone || queue.length > 0) {
      if (queue.length > 0) {
        yield queue.shift()!;
      } else {
        await new Promise<void>(resolve => resolveQueue = resolve);
      }
    }

    if (errorOccurred) {
      throw errorOccurred;
    }
  }

  async fetchApiModels(): Promise<ApiTypeModel[]> {
    const res = await getFastAPIAxiosInstance().get(`/model`);
    return res.data;
  }
}
