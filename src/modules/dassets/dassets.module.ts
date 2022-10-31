import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetFlowSessionModelModule, DassetNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserSchema, WebhookModelModule } from '@/schemas';
import { DassetsMigrateCmd } from './cmd/dassets-migrate.cmd';
import { DassetsMigratorService } from './services/dassets-migrator.service';
import { SyncerService } from '../syncer/services/syncer.service';
import { DassetsListenerService } from './services/dassets-listener.service';
import { DassetsMintCmd } from './cmd/dassets-mint.cmd';
import { DassetsMinterService } from './services/dassets-minter.service';
import { ChainSyncerModule, ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '../webhooks/services/webhooks.service';
import { DassetsController } from './dassets.controller';
import { StripeModule } from '../stripe/stripe.module';
import { AppSichModule } from '@/providers/app-sich.module';
import { DassetsPriceEstimatorService } from './services/dassets-price-estimator.service';
import { DassetsSessionService } from './services/dassets-session.service';

@Module({
  imports: [
    ScanTargetModelModule,
    ProjectModelModule,
    DassetNftModelModule,
    ChainSyncerModule,
    WebhookModelModule,
    DassetFlowSessionModelModule,
    StripeModule,
    AppSichModule,
  ],
  providers: [
    DassetsMigrateCmd,
    DassetsMigratorService,
    SyncerService,
    DassetsListenerService,
    DassetsMintCmd,
    DassetsMinterService,
    WebhooksService,
    DassetsPriceEstimatorService,
    DassetsSessionService,
  ],
  controllers: [DassetsController],
})
export class DassetsModule {}