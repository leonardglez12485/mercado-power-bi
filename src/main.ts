/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const log = new Logger('Bootstrap')
  app.setGlobalPrefix('api/docs');
  //validacion de los Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Mercado')
    .setVersion('1.0')
    .addTag('Mercado')
    .addApiKey({type: 'apiKey', name: 'Mercado', in: 'header'}, 'Api-Key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(process.env.PORT ||3001)
  log.log(`App Running at Port ${process.env.PORT}`)
  log.log(`App Connected to ${process.env.MONGODB}`)
  
}
bootstrap();
