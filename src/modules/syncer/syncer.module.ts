import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterInstanceModelModule, ProjectModelModule, SyncerInstanceModelModule, User, UserSchema } from '@/schemas';
import { ChainSyncerModule } from '@/providers/chain-syncer';
import { SyncerInstancesService } from './services/syncer-instances.service';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { SyncerHelpersService } from './services/syncer-helpers.service';

@Module({
  imports: [
    EventEmitterInstanceModelModule,
    ProjectModelModule,
    SyncerInstanceModelModule,
    EventEmitterInstanceModelModule,
    ChainSyncerModule,
    EventEmitterModule,
  ],
  providers: [
    SyncerInstancesService,
    SyncerHelpersService,
  ],
  exports: [
    SyncerInstancesService,
  ],
  controllers: [],
})
export class SyncerModule {}