import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Conversation } from '../conversations/conversation.entity';
import { UsersCoreService } from '../users/users.core.service';
import { ConversationsCoreService } from '../conversations/conversations.core.service';
import { FirebaseService } from '../users/firebase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Conversation]), ConfigModule],
  providers: [UsersCoreService, ConversationsCoreService, FirebaseService],
  exports: [UsersCoreService, ConversationsCoreService],
})
export class CoreModule {}
