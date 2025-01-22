import { IsArray, IsString } from 'class-validator';

export class FilesResDto {
  @IsArray()
  @IsString({ each: true })
  urls: string[];
}
