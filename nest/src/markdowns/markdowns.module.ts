import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Markdown } from './markdown.entity';
import { MarkdownsService } from './markdowns.service';
import { MarkdownsController } from './markdowns.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Markdown])],
  providers: [MarkdownsService],
  controllers: [MarkdownsController],
  exports: [],
})
export class MarkdownsModule {}
