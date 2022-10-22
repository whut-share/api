import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { GqlInvalidInputFilter, InvalidInputFilter, GqlBadRequestExceptionFilter } from './filters';
// import { AuthGuard } from './guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GqlInvalidInputFilter());
  app.useGlobalFilters(new GqlBadRequestExceptionFilter());
  app.useGlobalFilters(new InvalidInputFilter());

  // app.useGlobalGuards(new AuthGuard());

  app.enableCors();

  await app.listen(8000);
}
bootstrap();
