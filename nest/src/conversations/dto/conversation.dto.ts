import { UserResDto } from '../../users/dto/user.res.dto';
import { ConversationMessage } from '../interfaces/conversation-message.interface';

export class ConversationDto {
  id: number;
  name: string;
  messages: ConversationMessage[];
  users: UserResDto[];
}
