import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinterNftModelModule, KeyBunchModelModule, ProjectGroupModelModule, ProjectModelModule, SyncerInstanceModelModule, User, UserSchema } from '@/schemas';
import { KeyBunchesService } from './services/key-bunches.service';
import { SyncerModule } from '../syncer/syncer.module';
import { KeyBunchesResolver } from './key-bunches.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ProjectModelModule,
    KeyBunchModelModule,
    ProjectGroupModelModule,
    AuthModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    KeyBunchesService,
    KeyBunchesResolver,
  ],
  exports: [
    KeyBunchesService,
  ],
  controllers: [],
})
export class KeyBunchesModule {}