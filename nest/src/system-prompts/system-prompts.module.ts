import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemPrompt } from './system-prompt.entity';
import { SystemPromptsService } from './system-prompts.service';
import { SystemPromptsController } from './system-prompts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SystemPrompt]), UsersModule],
  providers: [SystemPromptsService],
  controllers: [SystemPromptsController],
  exports: [],
})
export class SystemPromptsModule {}
