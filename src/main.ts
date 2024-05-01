import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);

  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '10mb' });

  app.enableCors({
    origin: [
      'carlossanjuan.co',
      'https://carlossanjuan.co',
      'https://www.carlossanjuan.co',
    ],
    methods: 'GET,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(helmet());

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Carlos Sanjuan Message API')
    .setDescription('The Carlos Sanjuan Message API')
    .setVersion('1.0.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8000);
}

bootstrap();
