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
import { Request } from 'express';
import { MinioService } from './minio.service';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('files')
export class FilesController {
  constructor(private readonly minioService: MinioService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Headers('x-forwarded-proto') forwardedProto: string,
    @Headers('host') forwardedHost: string,
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.sub;
    const protocol = forwardedProto || req.protocol;
    const host = forwardedHost || req.get('host')!;

    const fileName = await this.minioService.uploadFile(userId, file);
    const fileUrl = this.minioService.getFileUrl(protocol, host, fileName);

    return { url: fileUrl };
  }
}
