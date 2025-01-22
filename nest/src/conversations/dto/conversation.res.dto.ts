import { PublicUserResDto } from '../../users/dto/public-user.res.dto';
import { ConversationMessage } from '../interfaces/conversation-message.interface';

export class ConversationResDto {
  id: number;
  name: string;
  messages: ConversationMessage[];
  publicUsers: PublicUserResDto[];
}
