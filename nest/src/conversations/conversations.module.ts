import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { UsersModule } from '../users/users.module';
import { ConversationsCoreService } from './conversations.core.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), UsersModule],
  providers: [ConversationsCoreService, ConversationsService],
  controllers: [ConversationsController],
  exports: [ConversationsCoreService],
})
export class ConversationsModule {}
