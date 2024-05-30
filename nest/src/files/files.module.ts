import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
})
export class FilesModule {}
