import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemPrompt } from './system-prompt.entity';
import { SystemPromptsService } from './system-prompts.service';
import { SystemPromptsController } from './system-prompts.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([SystemPrompt]), CoreModule],
  providers: [SystemPromptsService],
  controllers: [SystemPromptsController],
  exports: [],
})
export class SystemPromptsModule {}
