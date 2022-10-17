import { Global, Module } from '@nestjs/common';
import { TempFilesController } from './temp-files.controller';
import { TempFileModelModule } from './temp-files.model';

@Global()
@Module({
  imports: [
    TempFileModelModule
  ],
  providers: [
    
  ],
  controllers: [TempFilesController],
})
export class TempFilesModule {}