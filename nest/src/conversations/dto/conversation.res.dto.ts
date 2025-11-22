import { UserResDto } from '../../users/dto/user.res.dto';
import { Message } from '../message.entity';

export class ConversationResDto {
  id: number;
  name: string;
  messages: Message[];
  users: UserResDto[];
  updatedAt: Date;
  isPublic: boolean;
  colorLabel: string;
  version: number;
}

export class ConversationUpdateTimeResDto {
  id: number;
  updatedAt: Date;
}
