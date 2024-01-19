import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: [process.env.COOKIE_KEY],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // (app as any).set('etag', false);
  // app.use((req, res, next) => {
  //   res.removeHeader('x-powered-by');
  //   res.removeHeader('date');
  //   next();
  // });
  await app.listen(3000);
}
bootstrap();
