import { IsString, MaxLength } from 'class-validator';

export class LabelReqDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(32)
  color: string;
}
