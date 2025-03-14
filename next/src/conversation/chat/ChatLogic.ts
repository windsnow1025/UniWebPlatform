import {v4 as uuidv4} from 'uuid';
import ChatClient from "./ChatClient";
import {ApiTypeModel, ChatResponse, Citation} from "@/src/conversation/chat/Chat";
import {desanitize, sanitize} from "markdown-latex-renderer";
import {ContentTypeEnum, Message, MessageRoleEnum} from "@/client";

export default class ChatLogic {
  private chatService: ChatClient;
  public initMessages: Message[];
  public emptyUserMessage: Message;
  public emptyAssistantMessage: Message;
  public defaultApiTypeModels: ApiTypeModel[];

  constructor() {
    this.chatService = new ChatClient();

    this.initMessages = [
      {
        id: uuidv4(),
        role: MessageRoleEnum.System,
        contents: [
          {
            type: ContentTypeEnum.Text,
            data: "You are a helpful assistant."
          }
        ],
        display: "",
      },
      {
        id: uuidv4(),
        role: MessageRoleEnum.User,
        contents: [],
        display: "",
      }
    ];
    this.emptyUserMessage = {
      id: uuidv4(),
      role: MessageRoleEnum.User,
      contents: [],
      display: "",
    };
    this.emptyAssistantMessage = {
      id: uuidv4(),
      role: MessageRoleEnum.Assistant,
      contents: [],
      display: "",
    };

    this.defaultApiTypeModels = [
      {apiType: "", model: "", input: 0, output: 0},
    ]
  }

  createAssistantMessage(text: string, display: string): Message {
    return {
      id: uuidv4(),
      role: MessageRoleEnum.Assistant,
      contents: [
        {
          type: ContentTypeEnum.Text,
          data: text
        }
      ],
      display: display,
    };
  }

  appendToMessage(messages: Message[], index: number, chunk: ChatResponse): Message[] {
    const newMessages = [...messages];
    const currentMessage = newMessages[index];

    // Find text content or create one if it doesn't exist
    let textContentIndex = currentMessage.contents.findIndex(
      content => content.type === ContentTypeEnum.Text
    );

    if (textContentIndex === -1) {
      // No text content exists, create one
      currentMessage.contents.push({
        type: ContentTypeEnum.Text,
        data: chunk.text || ''
      });
    } else {
      // Update existing text content
      currentMessage.contents[textContentIndex] = {
        ...currentMessage.contents[textContentIndex],
        data: currentMessage.contents[textContentIndex].data + (chunk.text || '')
      };
    }

    // Update display property
    newMessages[index] = {
      ...currentMessage,
      display: (currentMessage.display || '') + (chunk.display || ''),
    };

    return newMessages;
  }

  replaceMessageText(messages: Message[], index: number, text: string): Message[] {
    const newMessages = [...messages];

    if (index < 0 || index >= newMessages.length) {
      return newMessages; // Index out of bounds, return unchanged
    }

    const message = newMessages[index];

    // Find text content index
    const textContentIndex = message.contents.findIndex(
      content => content.type === ContentTypeEnum.Text
    );

    if (textContentIndex === -1) {
      // No text content exists, create one
      message.contents.push({
        type: ContentTypeEnum.Text,
        data: text
      });
    } else {
      // Replace existing text content
      message.contents[textContentIndex] = {
        ...message.contents[textContentIndex],
        data: text
      };
    }

    return newMessages;
  }

  async fetchApiTypeModels(): Promise<ApiTypeModel[]> {
    try {
      return await this.chatService.fetchApiModels();
    } catch (err) {
      throw new Error("Failed to fetch API Models");
    }
  }

  getAllApiTypes(apiModels: ApiTypeModel[]): string[] {
    const apiTypes = apiModels.map(model => model.apiType);
    return Array.from(new Set(apiTypes));
  }

  getDefaultApiType(apiModels: ApiTypeModel[]): string {
    return this.getAllApiTypes(apiModels)[0];
  }

  filterApiTypeModelsByApiType(apiTypeModels: ApiTypeModel[], apiType: string): ApiTypeModel[] {
    if (!Array.isArray(apiTypeModels) || !apiTypeModels.length || !apiType) {
      return this.defaultApiTypeModels;
    }
    return apiTypeModels
      .filter(apiModel => apiModel.apiType === apiType)
  }

  filterDefaultModelByApiType(apiTypeModels: ApiTypeModel[], apiType: string): string {
    return this.filterApiTypeModelsByApiType(apiTypeModels, apiType)[0].model;
  }

  async nonStreamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number
  ): Promise<ChatResponse> {
    const desanitizedMessages = messages.map(message => {
      // Create a deep copy of the message
      const messageCopy = {...message};

      // Find and desanitize text content
      messageCopy.contents = message.contents.map(content => {
        if (content.type === ContentTypeEnum.Text) {
          return {
            ...content,
            data: desanitize(content.data)
          };
        }
        return content;
      });

      return messageCopy;
    });

    try {
      const content = await this.chatService.nonStreamGenerate(
        desanitizedMessages, api_type, model, temperature
      );
      if (content.error) {
        throw new Error(content.error);
      }

      let text = content.text;
      let citations = content.citations;
      if (text) {
        if (citations) {
          text = this.addCitations(text, citations);
        }
        text = sanitize(text);
      }

      return {
        text: text,
        display: content.display,
      };
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }

  async* streamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number
  ): AsyncGenerator<ChatResponse | string, void, unknown> {
    const desanitizedMessages = messages.map(message => {
      // Create a deep copy of the message
      const messageCopy = {...message};

      // Find and desanitize text content
      messageCopy.contents = message.contents.map(content => {
        if (content.type === ContentTypeEnum.Text) {
          return {
            ...content,
            data: desanitize(content.data)
          };
        }
        return content;
      });

      return messageCopy;
    });

    try {
      const response = this.chatService.streamGenerate(
        desanitizedMessages, api_type, model, temperature
      );

      let text = "";
      let citations: Citation[] = [];

      for await (const chunk of response) {
        if (chunk.error) {
          throw new Error(chunk.error);
        }

        let sanitizedChunkText;
        if (chunk.text) {
          sanitizedChunkText = sanitize(chunk.text);
          text += sanitizedChunkText;
        }
        if (chunk.citations) {
          citations = citations.concat(chunk.citations);
        }

        yield {
          text: sanitizedChunkText,
          display: chunk.display,
        }
      }

      yield this.addCitations(text, citations);
    } catch (err) {
      console.error("Error in POST /:", err);
      throw err;
    }
  }

  private addCitations(text: string, citations: Citation[]): string {
    for (const citation of citations) {
      const citationText = citation.text;
      const citationIndices = citation.indices;
      const index = text.indexOf(citationText) + citationText.length;
      const citationStr = citationIndices.map(i => `[${i}]`).join("");
      text = text.slice(0, index) + citationStr + text.slice(index);
    }
    return text;
  }
}
