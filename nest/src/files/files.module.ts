import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MinioService } from './minio.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, MinioService],
  exports: [],
})
export class FilesModule {}
