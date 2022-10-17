import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {

  console.log('CLI COMMAND -----------\n');
  
  await CommandFactory.run(AppModule).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

bootstrap();