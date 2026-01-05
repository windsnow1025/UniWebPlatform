import { UserResDto } from '../../users/dto/user.res.dto';
import { Message } from '../message.entity';
import { LabelResDto } from '../../labels/dto/label.res.dto';

export class ConversationResDto {
  id: number;
  name: string;
  messages: Message[];
  isPublic: boolean;
  users: UserResDto[];
  label: LabelResDto | null;
  updatedAt: Date;
  version: number;
}

export class ConversationUpdateTimeResDto {
  id: number;
  updatedAt: Date;
}
