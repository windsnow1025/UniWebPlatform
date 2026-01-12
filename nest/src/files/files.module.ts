import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MinioService } from './minio.service';

@Module({
  providers: [FilesService, MinioService],
  controllers: [FilesController],
  exports: [],
})
export class FilesModule {}
