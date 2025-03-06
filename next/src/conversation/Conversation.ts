import {Message} from "@/src/conversation/chat/Message";

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
}
