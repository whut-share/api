import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterInstanceModelModule, ProjectModelModule, QueuedSyncerEventModelModule, SyncerEventModelModule, SyncerInstanceModelModule, User, UserSchema } from '@/schemas';
import { ChainSyncerModule } from '@/providers/chain-syncer';
import { EventEmitterEventsService } from './services/event-emitter-events.service';
import { EventEmitterInstancesService } from './services/event-emitter-instances.service';
import { SyncerModule } from '../syncer/syncer.module';
import { SyncerInstancesService } from '../syncer/services/syncer-instances.service';
import { SyncerHelpersService } from '../syncer/services/syncer-helpers.service';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { EventEmitterHelpersService } from './services/event-emitter-helpers.service';
import { SyncerEventsResolver } from './syncer-events.resolver';
import { EventEmitterInstancesResolver } from './event-emitter-instances.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    EventEmitterInstanceModelModule,
    SyncerInstanceModelModule,
    SyncerEventModelModule,
    QueuedSyncerEventModelModule,
    ProjectModelModule,

    AuthModule,
    WebhooksModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    EventEmitterEventsService,
    EventEmitterInstancesService,
    EventEmitterHelpersService,
    SyncerHelpersService,

    SyncerEventsResolver,
    EventEmitterInstancesResolver,
  ],
  exports: [
    EventEmitterEventsService,
    EventEmitterInstancesService,
  ],
  controllers: [],
  
})
export class EventEmitterModule {}