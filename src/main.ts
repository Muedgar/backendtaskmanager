import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService()
  //  allow cross origin access
  app.enableCors({
        credentials: true,
        origin: [configService.get('FRONTEND_URL')]
    });

    await app.listen(configService.get('PORT'));
}
bootstrap();
