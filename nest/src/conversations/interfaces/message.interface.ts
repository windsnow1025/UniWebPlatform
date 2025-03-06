export interface Message {
  id: string; // uuid
  role: MessageRole;
  text: string;
  files: string[];
  display: string;
}

enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}
