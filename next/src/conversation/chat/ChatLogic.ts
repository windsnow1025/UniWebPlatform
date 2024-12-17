import { v4 as uuidv4 } from 'uuid';
import ChatClient, {StreamResponse} from "./ChatClient";
import {Message} from "./Message"
import {ApiTypeModel} from "@/src/conversation/chat/Chat";
import {desanitize, sanitize} from "markdown-latex-renderer";

export default class ChatLogic {
  private chatService: ChatClient;
  public initMessages: Message[];
  public emptyUserMessage: Message;
  public emptyAssistantMessage: Message;
  public defaultApiType: string;
  public defaultModel: string;
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

    this.defaultApiType = "open_ai";
    this.defaultModel = "gpt-4o";
    this.defaultApiModels = [
      {api_type: "open_ai", model: "chatgpt-4o-latest", input: 0, output: 0},
      {api_type: "azure", model: "gpt-4o", input: 0, output: 0},
      {api_type: "github", model: "gpt-4o", input: 0, output: 0},
      {api_type: "gemini", model: "gemini-1.5-pro-latest", input: 0, output: 0},
      {api_type: "claude", model: "claude-3-5-sonnet-20241022", input: 0, output: 0}
    ]
  }

  createUserMessage(text: string) {
    const message: Message = {
      id: uuidv4(),
      role: "user",
      text: text,
      files: []
    };
    return message;
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