import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors();

 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    transform: true, 
  }));

  
  const config = new DocumentBuilder()
    .setTitle('Game Service API')
    .setDescription('Manages game and run category data for WSpeedrun.com')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  await app.listen(3001);
  console.log(`Game Service is running on: http://localhost:3001`);
  console.log(`Swagger Docs are available on: http://localhost:3001/api/docs`);
}
bootstrap();
