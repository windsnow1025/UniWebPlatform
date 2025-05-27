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
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const multerOptions: MulterOptions = {
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB
  },
};

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async uploadFiles(
    @Req() req: RequestWithUser,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const userId = req.user.id;

    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const fullFilename = await this.filesService.create(userId, file);
        return this.filesService.getFileUrl(fullFilename);
      }),
    );

    return { urls: fileUrls };
  }

  @Get()
  async getFiles(@Req() req: RequestWithUser): Promise<FilesResDto> {
    const userId = req.user.id;

    const files = await this.filesService.findAll(userId);
    const fileUrls = files.map((fileName) =>
      this.filesService.getFileUrl(fileName),
    );

    return { urls: fileUrls };
  }

  @Delete('')
  async deleteFiles(
    @Req() req: RequestWithUser,
    @Body() deleteFilesReqDto: FilesReqDto,
  ): Promise<void> {
    const userId = req.user.id;
    await this.filesService.deleteFiles(userId, deleteFilesReqDto.filenames);
  }
}
