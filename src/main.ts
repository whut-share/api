import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { 
  GqlInvalidInputFilter, 
  InvalidInputFilter, 
  BadRequestExceptionFilter, 
  GqlForbiddenExceptionFilter
} from './filters';
// import { AuthGuard } from './guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalFilters(new InvalidInputFilter());
  // app.useGlobalFilters(new GqlForbiddenExceptionFilter());
  // app.useGlobalFilters(new InvalidInputFilter());

  // app.useGlobalGuards(new AuthGuard());

  app.enableCors();

  await app.listen(8000);
}
bootstrap();
