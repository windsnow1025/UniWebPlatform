import { UserResDto } from '../../users/dto/user.res.dto';
import { Content } from '../../conversations/message.entity';

export class SystemPromptResDto {
  id: number;
  name: string;
  contents: Content[];
  user: UserResDto;
  updatedAt: Date;
  version: number;
}
