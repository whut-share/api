import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanTargetModelModule, User, UserSchema } from '@/schemas';
import { DassetsMigrateCmd } from './cmd/dassets-migrate.cmd';
import { DassetsMigratorService } from './services/dassets-migrator.service';
import { SyncerService } from '../syncer/services/syncer.service';
import { DassetsInitService } from './services/dassets-init.service';
import { AppChSyModule } from '@/providers/app-chsy.module';

@Module({
  imports: [
    ScanTargetModelModule,
  ],
  providers: [
    DassetsMigrateCmd,
    DassetsMigratorService,
    SyncerService,
    DassetsInitService,
  ],
  controllers: [],
})
export class DassetsModule {}