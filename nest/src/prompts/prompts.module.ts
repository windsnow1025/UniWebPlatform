import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from './prompt.entity';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prompt]), CoreModule],
  providers: [PromptsService],
  controllers: [PromptsController],
  exports: [],
})
export class PromptsModule {}
