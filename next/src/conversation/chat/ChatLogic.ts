import {v4 as uuidv4} from 'uuid';
import ChatClient from "./ChatClient";
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

  createAssistantMessage(text: string): Message {
    return {
      id: uuidv4(),
      role: "assistant",
      text: text,
      files: []
    };
  }

  async fetchApiModels(): Promise<ApiTypeModel[]> {
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
    messages: Message[], api_type: string, model: string, temperature: number
  ): Promise<string> {
    const desanitizedMessages = messages.map(message => ({
      ...message,
      text: desanitize(message.text)
    }));

    try {
      const content = await this.chatService.nonStreamGenerate(
        desanitizedMessages, api_type, model, temperature
      );
      return sanitize(content.text!);
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }

  async* streamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number
  ): AsyncGenerator<string, void, unknown> {
    const desanitizedMessages = messages.map(message => ({
      ...message,
      text: desanitize(message.text)
    }));

    try {
      const response = this.chatService.streamGenerate(
        desanitizedMessages, api_type, model, temperature
      );

      for await (const chunk of response) {
        yield sanitize(chunk.text!);
      }
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }
}