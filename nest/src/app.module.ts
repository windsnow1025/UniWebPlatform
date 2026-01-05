import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import configuration from '../config/configuration';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { EmailVerificationGuard } from './common/guards/email-verification.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ConversationsModule } from './conversations/conversations.module';
import { Conversation } from './conversations/conversation.entity';
import { Markdown } from './markdowns/markdown.entity';
import { MarkdownsModule } from './markdowns/markdowns.module';
import { Announcement } from './announcement/announcement.entity';
import { AnnouncementModule } from './announcement/announcement.module';
import { SystemPrompt } from './system-prompts/system-prompt.entity';
import { SystemPromptsModule } from './system-prompts/system-prompts.module';
import { Label } from './labels/label.entity';
import { LabelsModule } from './labels/labels.module';

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
        type: 'postgres',
        host: configService.get<string>('postgres.host'),
        port: configService.get<number>('postgres.port'),
        username: configService.get<string>('postgres.user'),
        password: configService.get<string>('postgres.password'),
        database: configService.get<string>('postgres.database'),
        entities: [
          User,
          Conversation,
          Markdown,
          Announcement,
          SystemPrompt,
          Label,
        ],
        synchronize: true,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('redis.host');
        const redisPort = configService.get<number>('redis.port');
        const redisPassword = configService.get<string>('redis.password')!;
        const redisUrl = `redis://:${encodeURIComponent(redisPassword)}@${redisHost}:${redisPort}`;

        const store = createKeyv(redisUrl);

        const redisClient = (store as any).opts.store.client;

        if (redisClient) {
          redisClient.on('error', (error: any) =>
            console.error('error', error.message),
          );
        }

        store.on('error', (error) => {
          console.error('error', error);
        });

        return {
          stores: [store],
        };
      },
    }),
    JwtModule,
    CoreModule,
    AuthModule,
    UsersModule,
    FilesModule,
    ConversationsModule,
    MarkdownsModule,
    AnnouncementModule,
    SystemPromptsModule,
    LabelsModule,
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
      useClass: EmailVerificationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
