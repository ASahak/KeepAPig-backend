import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix(process.env.APP_GLOBAL_PREFIX);

  app.use(
      session({
        secret: 'keyboard',
        resave: false,
        saveUninitialized: false,
      })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  await app.listen(process.env.PORT);
}
bootstrap();
