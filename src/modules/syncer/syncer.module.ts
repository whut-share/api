import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanTargetModelModule, User, UserSchema } from '@/schemas';
import { SyncerService } from './services/syncer.service';
import { SyncerInitService } from './services/syncer-init.service';
import { ChainSyncerModule } from '@/providers/chain-syncer';

@Module({
  imports: [
    ScanTargetModelModule,
    ChainSyncerModule,
  ],
  providers: [
    SyncerService,
    SyncerInitService,
  ],
  controllers: [],
  
})
export class SyncerModule {}