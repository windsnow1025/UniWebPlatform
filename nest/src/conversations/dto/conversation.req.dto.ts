import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { Message } from '../message.entity';

export class ConversationReqDto {
  @IsString()
  name: string;

  @IsArray()
  messages: Message[];
}

export class ConversationNameReqDto {
  @IsString()
  name: string;
}

export class ConversationColorReqDto {
  @IsString()
  @MaxLength(32)
  colorLabel: string;
}
