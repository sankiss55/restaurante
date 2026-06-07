import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PostgresExceptionFilter } from './filters/postgres_exceptions.filters';
import { JWTExceptionFilter } from './filters/jwt_exceptions.filters';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform:true
  }))
  app.useGlobalFilters(new JWTExceptionFilter, new PostgresExceptionFilter);
  const config= new DocumentBuilder().setTitle("Documentacion api restaurante").addBearerAuth().build();
  const doc=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("docs",app, doc )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
