export class Message {
  id: string; // uuid
  role: MessageRole;
  text: string;
  files: string[];
  display: string;
}

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}
