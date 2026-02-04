import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import configuration from '../config/configuration';
import { AppConfig } from '../config/config.interface';
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
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<AppConfig>('app')!;
        return {
          type: 'postgres',
          host: config.postgres.host,
          port: config.postgres.port,
          username: config.postgres.user,
          password: config.postgres.password,
          database: config.postgres.database,
          entities: [
            User,
            Conversation,
            Markdown,
            Announcement,
            SystemPrompt,
            Label,
          ],
          synchronize: true,
          logging: ['query', 'error'],
          logger: 'advanced-console',
        };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<AppConfig>('app')!;
        const redisUrl = `redis://:${encodeURIComponent(config.redis.password)}@${config.redis.host}:${config.redis.port}`;

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
    PaymentModule,
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
