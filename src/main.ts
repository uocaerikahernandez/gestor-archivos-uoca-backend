import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Gestor Médico UOCA')
    .setDescription('API para gestionar manejo de archivos médicos en la UOCA')
    .setVersion('1.0')
    .addTag('doctors')
    .addTag('patients')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
}
bootstrap();
