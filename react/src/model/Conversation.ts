import { Message } from "./Message";

export interface Conversation {
    id: number;
    name: string;
    conversation: Message[];
}