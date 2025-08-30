import { IsArray, IsOptional, IsString } from 'class-validator';
import { Message } from '../message.entity';

export class ConversationReqDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  colorLabel?: string;

  @IsArray()
  messages: Message[];
}

export class ConversationNameReqDto {
  @IsString()
  name: string;
}
