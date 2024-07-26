import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({ limit: 'Infinity' }));
  app.use(bodyParser.urlencoded({ limit: 'Infinity', extended: true }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port')!;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
