import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformationInterceptor } from './interceptor/response.interceptor';
import * as cors from 'cors';  // Import du module cors

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Utilisation de CORS
  app.use(cors());  // Activer CORS pour toutes les requêtes (tu peux personnaliser plus tard si besoin)

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new TransformationInterceptor(app.get(Reflector)));

  // Lancer l'application sur le port
  await app.listen(process.env.DEV_PORT ?? 3000, '0.0.0.0');
}

bootstrap();
