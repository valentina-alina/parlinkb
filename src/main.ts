/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filters';
import { CustomHttpExceptionFilter } from './filters/custom-exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* const cors = {
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  }

  app.enableCors(cors); */
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(), new CustomHttpExceptionFilter());

  const config = new DocumentBuilder()
  .setTitle('alt-bootcamp')
  .setDescription('The alt-bootcamp API description')
  .setVersion('0.1')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
    await app.listen(3000);
  }
bootstrap();