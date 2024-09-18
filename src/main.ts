/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();
import compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filters';
import { CustomHttpExceptionFilter } from './filters/custom-exception.filters';
import { LoggingInterceptor } from './interceptors/logging.interceptors';
import { TransformInterceptor } from './interceptors/transform.interceptors';
import { SetHeadersInterceptor } from './interceptors/set-headers.interceptors';

async function bootstrap() {
  console.log('Application NestJS en cours de démarrage...');

  const app = await NestFactory.create(AppModule);
  console.log('Application NestJS créée.');

  const localhostUrl = process.env.LOCALHOST_URL;
  const ipv4Url = process.env.IPV4_URL;
  // const vercelUrl = process.env.VERCEL_URL;

  app.enableCors({
    origin: [localhostUrl,'http://localhost:3215'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization','refresh_token'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  });
  console.log('CORS configuré');

  app.useGlobalPipes(new ValidationPipe());
  console.log('Global validation pipe configuré.');

  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor(), new SetHeadersInterceptor());
  console.log('Interceptors configurés.');

  app.useGlobalFilters(new HttpExceptionFilter(), new CustomHttpExceptionFilter());
  console.log('Global exception filters configurés.');

  app.use(compression());
  console.log('Compression configuré.');

  const config = new DocumentBuilder()
  .setTitle('alt-bootcamp')
  .setDescription('The alt-bootcamp API description')
  .setVersion('0.1')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('Documentation Swagger documentation configurée.');
  await app.listen(process.env.PORT || 3215);
  console.log(`L'application NestJS écoute sur le port :  ${process.env.PORT} .`);
  console.log(`Front origins :  ${localhostUrl} .`);
}

bootstrap();