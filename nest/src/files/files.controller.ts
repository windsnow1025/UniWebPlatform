import {
  Body,
  Controller,
  Delete,
  Get,
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
  constructor(private readonly minioService: FilesService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.sub;

    const fullFilename = await this.minioService.create(userId, file);
    const fileUrl = this.minioService.getFileUrl(fullFilename);

    return { url: fileUrl };
  }

  @Get()
  async getFiles(@Req() req: RequestWithUser): Promise<FilesResDto> {
    const userId = req.user.sub;

    const files = await this.minioService.findAll(userId);
    const fileUrls = files.map((fileName) =>
      this.minioService.getFileUrl(fileName),
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
