import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import configuration from '../config/configuration';
import { RolesGuard } from './common/guards/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { Bookmark } from './bookmarks/bookmark.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ConversationsModule } from './conversations/conversations.module';
import { Conversation } from './conversations/conversation.entity';
import { Markdown } from './markdowns/markdown.entity';
import { MarkdownsModule } from './markdowns/markdowns.module';

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
        entities: [User, Bookmark, Conversation, Markdown],
        synchronize: true,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../uploads'),
      serveRoot: '/uploads',
    }),
    JwtModule,
    AuthModule,
    UsersModule,
    FilesModule,
    BookmarksModule,
    ConversationsModule,
    MarkdownsModule,
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
