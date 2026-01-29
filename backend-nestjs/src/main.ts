import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrls = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(',').map((url) => url.trim())
    : ['http://localhost:3000'];

  app.enableCors({
    origin: frontendUrls,
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerCfg = new DocumentBuilder()
    .setTitle('Tadaa API')
    .setDescription('This is a Swagger-API Documentation for the fullstack Application Tadaa.')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-dev-user-id', in: 'header' }, 'DevUserHeader')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('swagger', app, swaggerDoc);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
