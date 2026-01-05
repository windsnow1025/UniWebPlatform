import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersCoreService } from './users.core.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [
    UsersCoreService,
    UsersService,
    FirebaseService,
    FirebaseAdminService,
  ],
  controllers: [UsersController],
  exports: [UsersCoreService],
})
export class UsersModule {}
