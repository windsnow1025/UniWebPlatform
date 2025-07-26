import {v4 as uuidv4} from 'uuid';
import ChatClient from "./ChatClient";
import {ApiTypeModel, ChatResponse, Citation} from "@/lib/chat/ChatResponse";
import {Content, ContentTypeEnum, Message, MessageRoleEnum} from "@/client";
import FileLogic from "@/lib/common/file/FileLogic";

export default class ChatLogic {
  private chatService: ChatClient;
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
    this.chatService = new ChatClient();
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

  // For converting model generated image data to url
  static async getImageUrl(image: string) {
    const base64ToFile = (base64String: string, filename: string) => {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], filename, {type: "image/png"});
    };
    let imageUrl = null;
    if (image) {
      const file = base64ToFile(image, "generated_image.png");
      const fileLogic = new FileLogic();
      const uploadedFiles = await fileLogic.uploadFiles([file]);
      imageUrl = uploadedFiles[0];
    }
    return imageUrl;
  }

  // For converting model response to an assistant message - first chunk
  static createAssistantMessage(text: string, display: string, fileUrl: string): Message {
    const contents: Content[] = [
      {
        type: ContentTypeEnum.Text,
        data: text || ''
      }
    ];

    if (fileUrl) {
      contents.push({
        type: ContentTypeEnum.File,
        data: fileUrl
      });
    }

    return {
      id: uuidv4(),
      role: MessageRoleEnum.Assistant,
      contents: contents,
      display: display,
    };
  }

  // For converting model response to an assistant message - middle chunks
  static updateMessage(
    messages: Message[],
    index: number,
    chunk: ChatResponse,
    fileUrl: string
  ): Message[] {
    const newMessages = [...messages];

    if (index < 0 || index >= newMessages.length) {
      return newMessages;
    }

    // Create a deep copy of the message to modify
    const currentMessage = {...newMessages[index]};

    // Create a deep copy of the contents array
    currentMessage.contents = [...currentMessage.contents];

    // Append text if provided
    if (chunk.text) {
      let textContentIndex = currentMessage.contents.findIndex(
        content => content.type === ContentTypeEnum.Text
      );

      if (textContentIndex === -1) {
        currentMessage.contents.push({
          type: ContentTypeEnum.Text,
          data: chunk.text
        });
      } else {
        currentMessage.contents[textContentIndex] = {
          ...currentMessage.contents[textContentIndex],
          data: currentMessage.contents[textContentIndex].data + chunk.text
        };
      }
    }

    // Append file if provided
    if (fileUrl) {
      currentMessage.contents.push({
        type: ContentTypeEnum.File,
        data: fileUrl
      });
    }

    // Update display property if chunk has display text
    if (chunk.display) {
      currentMessage.display = (currentMessage.display || '') + chunk.display;
    }

    // Replace the message in the array with the updated one
    newMessages[index] = currentMessage;

    return newMessages;
  }

  // For converting model response to an assistant message - final chunks
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
      return await this.chatService.fetchApiModels();
    } catch (error) {
      throw new Error("Failed to fetch API Models");
    }
  }

  // For chat generate
  async nonStreamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number
  ): Promise<ChatResponse> {
    try {
      const content = await this.chatService.nonStreamGenerate(
        messages, api_type, model, temperature
      );
      if (content.error) {
        throw new Error(content.error);
      }

      let text = content.text;
      let citations = content.citations;
      if (text) {
        if (citations) {
          text = ChatLogic.addCitations(text, citations);
        }
      }

      return {
        text: text,
        image: content.image,
        display: content.display,
      };
    } catch (error) {
      console.error("Error in POST /:", error);
      throw error;
    }
  }

  // For chat generate
  async* streamGenerate(
    messages: Message[], api_type: string, model: string, temperature: number,
    onOpenCallback?: () => void,
  ): AsyncGenerator<ChatResponse | string, void, unknown> { // string for final citation text
    try {
      const response = this.chatService.streamGenerate(
        messages, api_type, model, temperature, onOpenCallback
      );

      let text = "";
      let citations: Citation[] = [];

      for await (const chunk of response) {
        if (chunk.error) {
          throw new Error(chunk.error);
        }

        if (chunk.text) {
          text += chunk.text;
        }
        if (chunk.citations) {
          citations = citations.concat(chunk.citations);
        }

        yield {
          text: chunk.text,
          image: chunk.image,
          display: chunk.display,
        }
      }

      yield ChatLogic.addCitations(text, citations);
    } catch (error) {
      console.error("Error in POST /:", error);
      throw error;
    }
  }

  // For chat generate
  private static addCitations(text: string, citations: Citation[]): string {
    for (const citation of citations) {
      const citationText = citation.text;
      const citationIndices = citation.indices;
      const index = text.indexOf(citationText) + citationText.length;
      const citationStr = `^${citationIndices.join(",")}^`;
      text = text.slice(0, index) + citationStr + text.slice(index);
    }
    return text;
  }
}
