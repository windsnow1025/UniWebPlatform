import {
  Controller,
  Headers,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { multerOptions } from './multer.config';

@Controller('files')
export class FilesController {
  constructor(private readonly configService: ConfigService) {}

  @Public()
  @Post('file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(
    @Headers('x-forwarded-proto') forwardedProto: string,
    @Headers('host') forwardedHost: string,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const protocol = forwardedProto || req.protocol;
    const host = forwardedHost || req.get('host');
    const baseUrl = this.configService.get<string>('baseUrl')!;
    const fileUrl = `${protocol}://${host}${baseUrl}/uploads/${file.filename}`;

    return { url: fileUrl };
  }
}
