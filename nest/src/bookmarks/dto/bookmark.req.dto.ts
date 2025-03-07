import { IsString } from 'class-validator';

export class BookmarkReqDto {
  @IsString()
  firstTitle: string;

  @IsString()
  secondTitle: string;

  @IsString()
  url: string;

  @IsString()
  comment: string;
}