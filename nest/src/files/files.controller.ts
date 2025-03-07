import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { FilesResDto } from './dto/files.res.dto';
import { FilesReqDto } from './dto/files.req.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly minioService: FilesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @Req() req: RequestWithUser,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const userId = req.user.sub;

    console.log(files.length);

    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const fullFilename = await this.minioService.create(userId, file);
        return this.minioService.getFileUrl(fullFilename);
      }),
    );

    return { urls: fileUrls };
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
