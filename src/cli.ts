import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {

  console.log('CLI COMMAND -----------\n');

  process.env['ENABLE_CHSY'] = 'false';
  process.env['ENABLE_WEBHOOKS'] = 'false';
  
  await CommandFactory.run(AppModule).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

bootstrap();