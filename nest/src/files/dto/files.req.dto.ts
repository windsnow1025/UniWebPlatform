import { IsArray, IsString } from 'class-validator';

export class FilesReqDto {
  @IsArray()
  @IsString({ each: true })
  filenames: string[];
}
