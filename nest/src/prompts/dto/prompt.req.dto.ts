import { IsArray, IsString } from 'class-validator';
import { Content } from '../../conversations/message.entity';

export class PromptReqDto {
  @IsString()
  name: string;

  @IsArray()
  contents: Content[];
}

export class PromptNameReqDto {
  @IsString()
  name: string;
}
