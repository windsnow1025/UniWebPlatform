export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export enum ContentType {
  Text = 'text',
  File = 'file',
  Code = 'code',
  CodeOutput = 'code_output',
}

export class Content {
  type: ContentType;
  data: string; // text or file path
}

export class Message {
  id?: string; // uuid, not send to FastAPI
  role: MessageRole;
  contents: Content[];

  // not send to FastAPI
  promptId?: number;
  thought?: string;
  display?: string;
}
