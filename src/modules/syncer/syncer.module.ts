import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterInstanceModelModule, ProjectModelModule, SyncerInstanceModelModule, User, UserSchema } from '@/schemas';
import { ChainSyncerModule } from '@/providers/chain-syncer';
import { SyncerInstancesService } from './services/syncer-instances.service';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { SyncerHelpersService } from './services/syncer-helpers.service';
import { SyncerInstancesResolver } from './syncer-instances.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    EventEmitterInstanceModelModule,
    ProjectModelModule,
    SyncerInstanceModelModule,
    EventEmitterInstanceModelModule,
    ChainSyncerModule,
    EventEmitterModule,
    AuthModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    SyncerInstancesResolver,
    SyncerInstancesService,
    SyncerHelpersService,
  ],
  exports: [
    SyncerInstancesService,
  ],
  controllers: [],
})
export class SyncerModule {}