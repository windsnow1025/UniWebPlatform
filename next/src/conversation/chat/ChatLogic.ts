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
        files: [],
        display: "",
      },
      {
        id: uuidv4(),
        role: "user",
        text: "",
        files: [],
        display: "",
      }
    ];
    this.emptyUserMessage = {
      id: uuidv4(),
      "role": "user",
      "text": "",
      "files": [],
      display: "",
    };
    this.emptyAssistantMessage = {
      id: uuidv4(),
      role: "assistant",
      text: "",
      files: [],
      display: "",
    };

    this.defaultApiModels = [
      {api_type: "", model: "", input: 0, output: 0},
    ]
  }

  createAssistantMessage(text: string, display: string): Message {
    return {
      id: uuidv4(),
      role: "assistant",
      text: text,
      files: [],
      display: display,
    };
  }

  appendToMessage(messages: Message[], index: number, chunk: ChatResponse): Message[] {
    const newMessages = [...messages];
    const message = newMessages[index];
    if (chunk.text) {
      message.text += chunk.text;
    }
    if (chunk.display) {
      message.display = chunk.display;
    }
    return messages;
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
  ): Promise<ChatResponse> {
    const desanitizedMessages = messages.map(message => ({
      ...message,
      text: desanitize(message.text)
    }));

    try {
      const content = await this.chatService.nonStreamGenerate(
        desanitizedMessages, api_type, model, temperature
      );
      if (content.error) {
        throw new Error(content.error);
      }
      return {
        text: content.text ? sanitize(content.text) : undefined,
        display: content.display,
      }
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }

  async* streamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number
  ): AsyncGenerator<ChatResponse, void, unknown> {
    const desanitizedMessages = messages.map(message => ({
      ...message,
      text: desanitize(message.text)
    }));

    try {
      const response = this.chatService.streamGenerate(
        desanitizedMessages, api_type, model, temperature
      );

      for await (const chunk of response) {
        if (chunk.error) {
          throw new Error(chunk.error);
        }
        yield {
          text: chunk.text ? sanitize(chunk.text) : undefined,
          display: chunk.display,
        }
      }
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }
}