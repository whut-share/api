import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { 
  InvalidInputFilter, 
  BadRequestExceptionFilter, 
} from './filters';
// import { AuthGuard } from './guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalFilters(new InvalidInputFilter());

  // app.useGlobalGuards(new AuthGuard());

  app.enableCors();

  await app.listen(8000);
}
bootstrap();
