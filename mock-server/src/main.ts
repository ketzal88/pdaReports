/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  // app.enableCors({
  //   allowedHeaders: ['content-type'],
  //   origin: 'http://localhost:4200',
  //   credentials: true,
  // });
  // agrega delay a las respuestas. en msecs.
  // app.use(function (req, res, next) {
  //   setTimeout(next, 500);
  // });

  //Para emular imagenes
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/pda/images/',
  });

  await app.listen(3000);
}
bootstrap();
