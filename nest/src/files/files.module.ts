import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
