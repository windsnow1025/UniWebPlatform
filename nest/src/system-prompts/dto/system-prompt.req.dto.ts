import { IsArray, IsString } from 'class-validator';
import { Content } from '../../conversations/message.entity';

export class SystemPromptReqDto {
  @IsString()
  name: string;

  @IsArray()
  contents: Content[];
}

export class SystemPromptNameReqDto {
  @IsString()
  name: string;
}
