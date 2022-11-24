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

@Module({
  imports: [
    EventEmitterInstanceModelModule,
    SyncerInstanceModelModule,
    SyncerEventModelModule,
    QueuedSyncerEventModelModule,
    ProjectModelModule,

    WebhooksModule,
  ],
  providers: [
    EventEmitterEventsService,
    EventEmitterInstancesService,
    EventEmitterHelpersService,
    SyncerHelpersService,
  ],
  exports: [
    EventEmitterEventsService,
    EventEmitterInstancesService,
  ],
  controllers: [],
  
})
export class EventEmitterModule {}