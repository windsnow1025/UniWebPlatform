import { Message } from "./Message";

export interface Conversation {
    id: number;
    name: string;
    messages: Message[];
}