import { IsString } from 'class-validator';

export class AnnouncementReqDto {
  @IsString()
  content: string;
}
