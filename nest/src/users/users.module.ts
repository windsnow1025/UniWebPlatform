import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, CoreModule],
  providers: [UsersService, FirebaseService, FirebaseAdminService],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
