import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), CoreModule],
  providers: [ConversationsService],
  controllers: [ConversationsController],
  exports: [],
})
export class ConversationsModule {}
