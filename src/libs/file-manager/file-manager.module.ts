import { Module, DynamicModule, Global } from '@nestjs/common';
import { IFileManagerDriver } from './driver.interface';
import { FileManager } from './file-manager';

@Global()
@Module({
  providers: [],
})
export class FileManagerModule {
  static forRoot(
    driver: () => IFileManagerDriver,
  ): DynamicModule {

    const provider = {
      provide: FileManager,
      useFactory: () => {
        return new FileManager(driver());
      },
    };

    return {
      module: FileManagerModule,
      providers: [ provider ],
      exports: [ provider ],
    };
  }
}