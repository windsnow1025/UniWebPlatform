import {v4 as uuidv4} from 'uuid';
import ChatClient from "./ChatClient";
import {ApiTypeModel, ChatResponse, ResponseFile} from "@/lib/chat/ChatResponse";
import {Content, ContentTypeEnum, Message, MessageRoleEnum} from "@/client/nest";
import FileLogic from "@/lib/common/file/FileLogic";
import {handleError} from "@/lib/common/ErrorHandler";

export default class ChatLogic {
  private chatClient: ChatClient;
  static getInitMessages = (): Message[] => [
    {
      id: uuidv4(),
      role: MessageRoleEnum.System,
      contents: [
        {
          type: ContentTypeEnum.Text,
          data: "You are a helpful assistant."
        }
      ],
    },
    {
      id: uuidv4(),
      role: MessageRoleEnum.User,
      contents: [
        {
          type: ContentTypeEnum.Text,
          data: ""
        }
      ],
    }
  ];
  static getEmptyUserMessage = (): Message => ({
    id: uuidv4(),
    role: MessageRoleEnum.User,
    contents: [
      {
        type: ContentTypeEnum.Text,
        data: ""
      }
    ],
  });
  static getEmptyAssistantMessage = (): Message => ({
    id: uuidv4(),
    role: MessageRoleEnum.Assistant,
    contents: [
      {
        type: ContentTypeEnum.Text,
        data: ""
      }
    ],
  });
  static defaultApiTypeModels: ApiTypeModel[] = [
    {apiType: "", model: "", input: 0, output: 0},
  ];

  constructor() {
    this.chatClient = new ChatClient();
  }

  // For deleting files from storage
  static getFileUrlsFromMessage(message: Message): string[] {
    return message.contents
      .filter(content => content.type === ContentTypeEnum.File)
      .map(content => content.data);
  }

  // For deleting files from storage
  static getFileUrlsFromMessages(messages: Message[]): string[] {
    return messages
      .flatMap(message => ChatLogic.getFileUrlsFromMessage(message));
  }

  // For converting model generated file data to urls
  static async getFileUrls(files: ResponseFile[]): Promise<string[]> {
    if (files.length === 0) {
      return [];
    }

    const base64ToFile = (name: string, data: string, type: string) => {
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], name, {type: type});
    };

    const fileObjects = files.map((file) =>
      base64ToFile(file.name, file.data, file.type)
    );

    const fileLogic = new FileLogic();
    return await fileLogic.uploadFiles(fileObjects);
  }

  // For converting model response to an assistant message - first chunk
  static createAssistantMessage(
    text: string,
    thought: string,
    display: string,
    fileUrls: string[],
  ): Message {
    const contents: Content[] = [
      {
        type: ContentTypeEnum.Text,
        data: text || ''
      }
    ];

    if (fileUrls && fileUrls.length > 0) {
      fileUrls.forEach(fileUrl => {
        contents.push({
          type: ContentTypeEnum.File,
          data: fileUrl
        });
      });
    }

    return {
      id: uuidv4(),
      role: MessageRoleEnum.Assistant,
      contents: contents,
      thought: thought,
      display: display,
    };
  }

  // For converting model response to an assistant message - middle chunks
  static updateMessage(
    messages: Message[],
    index: number,
    chunk: ChatResponse,
    fileUrls: string[]
  ): Message[] {
    const newMessages = [...messages];

    if (index < 0 || index >= newMessages.length) {
      return newMessages;
    }

    // Deep Copy
    const currentMessage = {...newMessages[index]};
    currentMessage.contents = [...currentMessage.contents];

    if (chunk.text) {
      const lastContent = currentMessage.contents[currentMessage.contents.length - 1];

      if (lastContent && lastContent.type === ContentTypeEnum.Text) {
        // Append to last Text content
        lastContent.data += chunk.text;
      } else {
        // Create new Text content
        currentMessage.contents.push({
          type: ContentTypeEnum.Text,
          data: chunk.text
        });
      }
    }

    if (fileUrls && fileUrls.length > 0) {
      fileUrls.forEach(fileUrl => {
        currentMessage.contents.push({
          type: ContentTypeEnum.File,
          data: fileUrl
        });
      });
    }

    if (chunk.thought) {
      currentMessage.thought = (currentMessage.thought || '') + chunk.thought;
    }
    if (chunk.display) {
      currentMessage.display = (currentMessage.display || '') + chunk.display;
    }

    // Replace the message in the array with the updated one
    newMessages[index] = currentMessage;

    return newMessages;
  }

  // For converting model response to an assistant message - final chunk
  static replaceMessageText(
    messages: Message[], messageIndex: number, contentIndex: number, text: string
  ): Message[] {
    return messages.map((message, index) => {
      if (index !== messageIndex) {
        return message;
      }

      return {
        ...message,
        contents: message.contents.map((content, cIndex) => {
          if (cIndex !== contentIndex) {
            return content;
          }
          return {
            ...content,
            data: text
          };
        })
      };
    });
  }

  // For chat config
  static getAllApiTypes(apiModels: ApiTypeModel[]): string[] {
    const apiTypes = apiModels.map(model => model.apiType);
    return Array.from(new Set(apiTypes));
  }

  // For chat config
  static getDefaultApiType(apiModels: ApiTypeModel[]): string {
    return ChatLogic.getAllApiTypes(apiModels)[0];
  }

  // For chat config
  static filterApiTypeModelsByApiType(
    apiTypeModels: ApiTypeModel[], apiType: string
  ): ApiTypeModel[] {
    if (!Array.isArray(apiTypeModels) || !apiTypeModels.length || !apiType) {
      return ChatLogic.defaultApiTypeModels;
    }
    return apiTypeModels
      .filter(apiModel => apiModel.apiType === apiType)
  }

  // For chat config
  static filterDefaultModelByApiType(apiTypeModels: ApiTypeModel[], apiType: string): string {
    return ChatLogic.filterApiTypeModelsByApiType(apiTypeModels, apiType)[0].model;
  }

  // For chat config
  async fetchApiTypeModels(): Promise<ApiTypeModel[]> {
    try {
      return await this.chatClient.fetchApiModels();
    } catch (error) {
      throw new Error("Failed to fetch API Models");
    }
  }

  // For chat generate
  private static filterOutboundMessages(messages: Message[]): Message[] {
    return messages.map((msg) => ({
      role: msg.role,
      contents: msg.contents,
    }));
  }

  // For chat generate
  async nonStreamGenerate(
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    thought: boolean,
    code_execution: boolean,
  ): Promise<ChatResponse> {
    try {
      const filteredMessages = ChatLogic.filterOutboundMessages(messages);
      const content = await this.chatClient.nonStreamGenerate(
        filteredMessages, api_type, model, temperature, thought, code_execution
      );
      if (content.error) {
        throw new Error(content.error);
      }

      let text = '';
      if (content.code) {
        text += `\n# Code\n\n\`\`\`\n${content.code}\n\`\`\`\n`;
      }
      if (content.code_output) {
        text += `\n# Code Output\n\n\`\`\`\n${content.code_output}\n\`\`\`\n`;
      }
      if (content.text) {
        text += content.text;
      }

      return {
        text: text,
        thought: content.thought,
        files: content.files,
        display: content.display,
      };
    } catch (error) {
      handleError(error, 'Failed to generate non-streaming chat response');
    }
  }

  // For chat generate
  async* streamGenerate(
    messages: Message[],
    api_type: string,
    model: string,
    temperature: number,
    thought: boolean,
    code_execution: boolean,
    onOpenCallback?: () => void,
  ): AsyncGenerator<ChatResponse | string, void, unknown> { // string for final text
    try {
      const filteredMessages = ChatLogic.filterOutboundMessages(messages);
      const response = this.chatClient.streamGenerate(
        filteredMessages, api_type, model, temperature, thought, code_execution, onOpenCallback
      );

      let text = "";

      let openSection: 'code' | 'code_output' | null = null;

      for await (const chunk of response) {
        if (chunk.error) {
          throw new Error(`chunk.error: ${chunk.error}`);
        }

        let chunkText = '';

        // Text section
        if (chunk.text) {
          if (openSection) {
            chunkText += '\n```\n';
            openSection = null;
          }
          chunkText += chunk.text;
        }

        // Code section
        if (chunk.code) {
          if (openSection && openSection !== 'code') {
            chunkText += '\n```\n';
          }
          if (openSection !== 'code') {
            chunkText += '\n# Code\n\n```\n';
            openSection = 'code';
          }
          chunkText += chunk.code;
        }

        // Code Output section
        if (chunk.code_output) {
          if (openSection && openSection !== 'code_output') {
            chunkText += '\n```\n';
          }
          if (openSection !== 'code_output') {
            chunkText += '\n# Code Output\n\n```\n';
            openSection = 'code_output';
          }
          chunkText += chunk.code_output;
        }

        text += chunkText;

        yield {
          text: chunkText,
          thought: chunk.thought,
          files: chunk.files,
          display: chunk.display,
        }
      }

      if (openSection) {
        text += '\n```\n';
      }

      yield text;
    } catch (error) {
      handleError(error, 'Failed to generate streaming chat response');
    }
  }
}