import {v4 as uuidv4} from 'uuid';
import ChatClient, {StreamResponse} from "./ChatClient";
import {Message} from "./Message"
import {ApiTypeModel, ChatResponse} from "@/src/conversation/chat/Chat";
import {desanitize, sanitize} from "markdown-latex-renderer";

export default class ChatLogic {
  private chatService: ChatClient;
  public initMessages: Message[];
  public emptyUserMessage: Message;
  public emptyAssistantMessage: Message;
  public defaultApiModels: ApiTypeModel[];

  constructor() {

    this.chatService = new ChatClient();

    this.initMessages = [
      {
        id: uuidv4(),
        role: "system",
        text: "You are a helpful assistant.",
        files: []
      },
      {
        id: uuidv4(),
        role: "user",
        text: "",
        files: []
      }
    ];

    this.emptyUserMessage = {
      id: uuidv4(),
      "role": "user",
      "text": "",
      "files": []
    };
    this.emptyAssistantMessage = {
      id: uuidv4(),
      role: "assistant",
      text: "",
      files: []
    };

    this.defaultApiModels = [
      {api_type: "", model: "", input: 0, output: 0},
    ]
  }

  createAssistantMessage(text: string) {
    const message: Message = {
      id: uuidv4(),
      role: "assistant",
      text: text,
      files: []
    };
    return message;
  }

  async fetchApiModels() {
    try {
      return await this.chatService.fetchApiModels();
    } catch (err) {
      throw new Error("Failed to fetch API Models");
    }
  }

  getAllApiTypes(apiModels: ApiTypeModel[]): string[] {
    const apiTypes = apiModels.map(model => model.api_type);
    return Array.from(new Set(apiTypes));
  }

  getDefaultApiType(apiModels: ApiTypeModel[]): string {
    return this.getAllApiTypes(apiModels)[0];
  }

  filterModelsByApiType(apiModels: ApiTypeModel[], apiType: string): string[] {
    if (!Array.isArray(apiModels)) {
      apiModels = this.defaultApiModels;
    }
    return apiModels
      .filter(apiModel => apiModel.api_type === apiType)
      .map(apiModel => apiModel.model);
  }

  filterDefaultModelByApiType(apiModels: ApiTypeModel[], apiType: string): string {
    return this.filterModelsByApiType(apiModels, apiType)[0];
  }

  async nonStreamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number, stream: boolean
  ) {
    const desanitizedMessages = messages.map(message => ({
      ...message,
      text: desanitize(message.text)
    }));

    try {
      const content = await this.chatService.generate(desanitizedMessages, api_type, model, temperature, stream) as ChatResponse;
      return sanitize(content.text);
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }

  async* streamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number, stream: boolean
  ) {
    let controller;

    const desanitizedMessages = messages.map(message => ({
      ...message,
      text: desanitize(message.text)
    }));

    try {

      const response = await this.chatService.generate(desanitizedMessages, api_type, model, temperature, stream) as StreamResponse;
      controller = response.controller;
      const reader = response.reader;

      while (true) {
        const {value, done} = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const chatResponses = this.parseJsonChunk<ChatResponse>(chunk);
        for (const jsonObject of chatResponses) {
          yield sanitize(jsonObject.text);
        }
      }

    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    } finally {
      if (controller) {
        controller.abort();
      }
    }
  }

  parseJsonChunk<T>(chunk: string): T[] {
    const jsonObjects: T[] = [];

    const jsonRegex = /{.*?}/g;
    const matches = chunk.match(jsonRegex);

    if (matches) {
      for (const match of matches) {
        try {
          const jsonObject = JSON.parse(match) as T;
          jsonObjects.push(jsonObject);
        } catch (err) {
          console.error("Error parsing JSON:", err, match);
        }
      }
    }

    return jsonObjects;
  }
}