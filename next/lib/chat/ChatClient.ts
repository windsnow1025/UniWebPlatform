import {ApiTypeModel, ChatResponse} from "./ChatResponse";
import {getAPIBaseURLs, getFastAPIOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {EventSourceMessage, fetchEventSource} from '@microsoft/fetch-event-source';
import {handleError} from "@/lib/common/ErrorHandler";
import {DefaultApi, type ChatRequest, type Message} from "@/client/fastapi";
import {StorageKeys} from "@/lib/common/Constants";

export default class ChatClient {
  async nonStreamGenerate(
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    thought: boolean,
    code_execution: boolean,
  ): Promise<ChatResponse> {
    const requestData: ChatRequest = {
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: false,
      thought: thought,
      code_execution: code_execution,
    };

    try {
      const api = new DefaultApi(getFastAPIOpenAPIConfiguration());
      const res = await api.generateChatPost(requestData);
      return res.data;
    } catch (error) {
      handleError(error, 'Failed to generate non-streaming chat response');
    }
  }

  async* streamGenerate(
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    thought: boolean,
    code_execution: boolean,
    onOpenCallback?: () => void,
  ): AsyncGenerator<ChatResponse, void, unknown> {
    const token = localStorage.getItem(StorageKeys.Token)!;

    const requestData: ChatRequest = {
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: true,
      thought: thought,
      code_execution: code_execution,
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
        'Authorization': `Bearer ${token}`
      },
      openWhenHidden: true,
      async onopen(response: Response) {
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

          let message = '';
          if (resJson && resJson.detail) {
            message = resJson.detail;
          }

          throw new Error(`${status} ${statusText}: ${message}.`);
        }
      },
      onmessage(event: EventSourceMessage) {
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
      onerror(err: any) {
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
    const api = new DefaultApi(getFastAPIOpenAPIConfiguration());
    const res = await api.getModelsModelGet();
    return res.data;
  }
}
