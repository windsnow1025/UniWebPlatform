import {ApiTypeModel, ChatResponse} from "./ChatResponse";
import {getAPIBaseURLs, getFastAPIOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {EventSourceMessage, fetchEventSource} from '@microsoft/fetch-event-source';
import {handleError} from "@/lib/common/ErrorHandler";
import {type ChatRequest, DefaultApi, type Message} from "@/client/fastapi";
import {StorageKeys} from "@/lib/common/Constants";

export default class ChatClient {
  async nonStreamGenerate(
    request_id: string,
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    thought: boolean,
    code_execution: boolean,
    conversation_id?: number,
  ): Promise<ChatResponse> {
    const requestData: ChatRequest = {
      request_id: request_id,
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: false,
      thought: thought,
      code_execution: code_execution,
      conversation_id: conversation_id,
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
    request_id: string,
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    thought: boolean,
    code_execution: boolean,
    conversation_id?: number,
    onOpenCallback?: () => void,
    onDoneCallback?: () => void,
    signal?: AbortSignal,
  ): AsyncGenerator<ChatResponse, void, unknown> {
    const token = localStorage.getItem(StorageKeys.Token)!;

    const requestData: ChatRequest = {
      request_id: request_id,
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: true,
      thought: thought,
      code_execution: code_execution,
      conversation_id: conversation_id,
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
      signal: signal,
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
        if (parsedData.done) {
          if (onDoneCallback) {
            onDoneCallback();
          }
          return;
        }
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

  async abortChat(request_id: string): Promise<boolean> {
    const api = new DefaultApi(getFastAPIOpenAPIConfiguration());
    const res = await api.abortChatChatAbortPost({request_id});
    return res.data;
  }

  async fetchApiModels(): Promise<ApiTypeModel[]> {
    const api = new DefaultApi(getFastAPIOpenAPIConfiguration());
    const res = await api.getModelsModelGet();
    return res.data;
  }
}
