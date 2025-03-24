export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export enum ContentType {
  Text = 'text',
  File = 'file',
}

export class Content {
  type: ContentType;
  data: string; // text or file path
}

export class Message {
  id: string; // uuid
  role: MessageRole;
  contents: Content[];

  // Only for Response
  image?: string;
  display?: string;
}
