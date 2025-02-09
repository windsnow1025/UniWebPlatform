import axios from 'axios';
import {Message} from './Message'
import {ApiTypeModel} from "./Chat";
import {getAPIBaseURLs, getFastAPIAxiosInstance} from "@/src/common/APIConfig";
import {fetchEventSource} from '@microsoft/fetch-event-source';

export default class ChatClient {
  async generate(
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    stream: boolean
  ): Promise<string | AsyncGenerator<string, void, unknown>> {
    const token = localStorage.getItem('token')!;

    const requestData = {
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: stream
    };

    if (!stream) {
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
            const detail = error.response.data?.detail || error.response.statusText;
            throw new Error(`${status}: ${detail}`);
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    } else {
      const controller = new AbortController();

      const streamGenerator = async function* () {
        const queue: string[] = [];
        let resolveQueue: (() => void) | null = null;
        let isDone = false;

        fetchEventSource(`${getAPIBaseURLs().fastAPI}/chat`, {
          method: "POST",
          body: JSON.stringify(requestData),
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          async onopen(response) {
            if (!response.ok) {
              const status = response.status;
              const statusText = response.statusText;
              let resJson;
              try {
                resJson = await response.json();
              } catch (error) {
                console.error(error);
              }
              if (resJson && resJson.detail) {
                throw new Error(`${status} : ${resJson.detail}`);
              }
              throw new Error(`${status}: ${statusText}`);
            }
          },
          onmessage(event) {
            queue.push(event.data);
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
            console.error("Stream error:", err);
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
      };

      return streamGenerator();
    }
  }

  async fetchApiModels(): Promise<ApiTypeModel[]> {
    const res = await getFastAPIAxiosInstance().get(`/model`);
    return res.data;
  }
}
