import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { ConfigService } from '@nestjs/config';
import { multerOptions } from './multer.config';

@Controller()
export class FilesController {
  constructor(private readonly configService: ConfigService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['host'] || req.get('host');
    const baseUrl = this.configService.get<string>('baseUrl')!;
    const fileUrl = `${protocol}://${host}${baseUrl}/uploads/${file.filename}`;

    return { url: fileUrl };
  }
}
