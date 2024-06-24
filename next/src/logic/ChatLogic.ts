import ChatService, {StreamResponse} from "../service/ChatService";
import {Message} from "../model/Message"
import {ApiTypeModel} from "@/src/model/Chat";
import {sanitize, desanitize} from "@/src/util/MarkdownParser";

export class ChatLogic {
  private chatService: ChatService;
  public initMessages: Message[];
  public emptyUserMessage: Message;
  public emptyAssistantMessage: Message;
  public defaultApiType: string;
  public defaultApiModels: ApiTypeModel[];

  constructor() {

    this.chatService = new ChatService();

    this.initMessages = [
      {
        "role": "system",
        "text": "You are a helpful assistant.",
        "files": []
      },
      {
        "role": "user",
        "text": "",
        "files": []
      }
    ];

    this.emptyUserMessage = {
      "role": "user",
      "text": "",
      "files": []
    };
    this.emptyAssistantMessage = {
      "role": "assistant",
      "text": "",
      "files": []
    };

    this.defaultApiType = "open_ai";
    this.defaultApiModels = [
      {"api_type": "open_ai", "model": "gpt-4o"},
      {"api_type": "azure", "model": "gpt-4"},
      {"api_type": "gemini", "model": "gemini-1.5-pro-latest"}
    ]
  }

  createAssistantMessage(text: string) {
    const message: Message = {
      "role": "assistant",
      "text": text,
      "files": []
    }
    return message;
  }

  async fetchApiModels() {
    try {
      return await this.chatService.fetchApiModels();
    } catch (err) {
      throw new Error("Failed to fetch API Models");
    }
  }

  filterModelsByApiType(apiModels: ApiTypeModel[], apiType: string) {
    if(!Array.isArray(apiModels)) {
      apiModels = this.defaultApiModels;
    }
    return apiModels
      .filter(model => model.api_type === apiType)
      .map(model => model.model);
  }

  filterDefaultModelByApiType(apiType: string) {
    return this.defaultApiModels.filter(model => model.api_type === apiType)[0].model;
  }

  async nonStreamGenerate(messages: Message[], api_type: string, model: string, temperature: number, stream: boolean) {
    const desanitizedMessages = messages.map(message => ({
      ...message,
      text: desanitize(message.text)
    }));

    try {
      const content = await this.chatService.generate(desanitizedMessages, api_type, model, temperature, stream) as string;
      return sanitize(content);
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }

  async *streamGenerate(messages: Message[], api_type: string, model: string, temperature: number, stream: boolean) {
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
        yield sanitize(new TextDecoder().decode(value));
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
}