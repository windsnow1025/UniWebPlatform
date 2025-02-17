import {
  Body,
  Controller, Delete,
  Get,
  Headers,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { FilesResDto } from './dto/files.res.dto';
import { FilesReqDto } from './dto/files.req.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly minioService: FilesService) {
  }

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

    const fullFilename = await this.minioService.create(userId, file);
    const fileUrl = this.minioService.getFileUrl(protocol, host, fullFilename);

    return { url: fileUrl };
  }

  @Get()
  async getFiles(
    @Headers('x-forwarded-proto') forwardedProto: string,
    @Headers('host') forwardedHost: string,
    @Req() req: RequestWithUser,
  ): Promise<FilesResDto> {
    const userId = req.user.sub;
    const protocol = forwardedProto || req.protocol;
    const host = forwardedHost || req.get('host')!;

    const files = await this.minioService.findAll(userId);
    const fileUrls = files.map((fileName) =>
      this.minioService.getFileUrl(protocol, host, fileName),
    );

    return { urls: fileUrls };
  }

  @Delete('')
  async deleteFiles(
    @Req() req: RequestWithUser,
    @Body() deleteFilesReqDto: FilesReqDto,
  ): Promise<void> {
    const userId = req.user.sub;
    await this.minioService.deleteFiles(userId, deleteFilesReqDto.filenames);
  }
}
