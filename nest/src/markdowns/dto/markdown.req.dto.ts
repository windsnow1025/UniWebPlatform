import { IsString } from 'class-validator';

export class MarkdownReqDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
