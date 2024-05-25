import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { Bookmark } from './bookmarks/bookmark.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('mysql.host'),
        port: 3306,
        username: configService.get<string>('mysql.user'),
        password: configService.get<string>('mysql.password'),
        database: configService.get<string>('mysql.database'),
        entities: [User, Bookmark],
        synchronize: true,
      }),
    }),
    JwtModule,
    AuthModule,
    UsersModule,
    BookmarksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
