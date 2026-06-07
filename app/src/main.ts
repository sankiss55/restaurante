import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PostgresExceptionFilter } from './filters/postgres_exceptions.filters';
import { JWTExceptionFilter } from './filters/jwt_exceptions.filters';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';  
import { join } from 'path';
async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',  
  });
  // Configurar Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: true, // Esto hace que acepte cualquier origen permitiendo credenciales
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    transformOptions: {
        enableImplicitConversion: true, 
    },
  }))
  app.useGlobalFilters(new JWTExceptionFilter, new PostgresExceptionFilter);
  const config= new DocumentBuilder().setTitle("Documentacion api restaurante").addBearerAuth().build();
  const doc=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("docs",app, doc )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
