import { UserDto } from '../../users/dto/user.dto';
import { ConversationMessage } from '../interfaces/conversation-message.interface';

export class ConversationDto {
  id: number;
  name: string;
  messages: ConversationMessage[];
  users: UserDto[];
}
