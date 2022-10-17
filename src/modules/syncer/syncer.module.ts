import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanTargetModelModule, User, UserSchema } from '@/schemas';
import { SyncerService } from './services/syncer.service';
import { SyncerInitService } from './services/syncer-init.service';

@Module({
  imports: [
    ScanTargetModelModule,
  ],
  providers: [
    SyncerService,
    SyncerInitService,
  ],
  controllers: [],
})
export class SyncerModule {}