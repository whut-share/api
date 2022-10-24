import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserSchema, WebhookModelModule } from '@/schemas';
import { DassetsMigrateCmd } from './cmd/dassets-migrate.cmd';
import { DassetsMigratorService } from './services/dassets-migrator.service';
import { SyncerService } from '../syncer/services/syncer.service';
import { DassetsListenerService } from './services/dassets-listener.service';
import { DassetsMintCmd } from './cmd/dassets-mint.cmd';
import { DassetsMinterService } from './services/dassets-minter.service';
import { ChainSyncerModule, ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '../webhooks/services/webhooks.service';
import { DassetsController } from './dassets.controller';

@Module({
  imports: [
    ScanTargetModelModule,
    ProjectModelModule,
    DassetNftModelModule,
    ChainSyncerModule,
    WebhookModelModule,
  ],
  providers: [
    DassetsMigrateCmd,
    DassetsMigratorService,
    SyncerService,
    DassetsListenerService,
    DassetsMintCmd,
    DassetsMinterService,
    WebhooksService,
  ],
  controllers: [DassetsController],
})
export class DassetsModule {}