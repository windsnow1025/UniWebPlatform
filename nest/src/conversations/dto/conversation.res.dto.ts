import { UserResDto } from '../../users/dto/user.res.dto';
import { Message } from '../interfaces/message.interface';

export class ConversationResDto {
  id: number;
  name: string;
  messages: Message[];
  users: UserResDto[];
}
