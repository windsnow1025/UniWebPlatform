import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
  providers: [MinioService],
})
export class FilesModule {}
