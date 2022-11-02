import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetFlowSessionModelModule, DassetNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserModelModule, UserSchema, WebhookModelModule } from '@/schemas';
import { DassetsMigrateCmd } from './cmd/dassets-migrate.cmd';
import { DassetsMigratorService } from './services/dassets-migrator.service';
import { SyncerService } from '../syncer/services/syncer.service';
import { DassetsSyncerListenerService } from './services/dassets-syncer-listener.service';
import { DassetsMintCmd } from './cmd/dassets-mint.cmd';
import { DassetsMinterService } from './services/dassets-minter.service';
import { ChainSyncerModule, ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '../webhooks/services/webhooks.service';
import { DassetsController } from './dassets.controller';
import { StripeModule } from '../stripe/stripe.module';
import { AppSichModule } from '@/providers/app-sich.module';
import { DassetsPriceEstimatorService } from './services/dassets-price-estimator.service';
import { DassetsSessionService } from './services/dassets-session.service';
import { DassetsSessionSeedCmd } from './cmd/dassets-session-seed.cmd';
import { AuthService } from '../auth/services/auth.service';
import { DassetsStripeListenerService } from './services/dassets-stripe-listener.service';
import { DassetsEventsProcessorService } from './services/dassets-events-processor.service';

@Module({
  imports: [
    ScanTargetModelModule,
    ProjectModelModule,
    DassetNftModelModule,
    ChainSyncerModule,
    WebhookModelModule,
    UserModelModule,
    DassetFlowSessionModelModule,
    StripeModule,
    AppSichModule,
  ],
  providers: [
    AuthService,
    DassetsMigrateCmd,
    DassetsMigratorService,
    SyncerService,
    DassetsMintCmd,
    DassetsMinterService,
    WebhooksService,
    DassetsPriceEstimatorService,
    DassetsSessionService,
    DassetsSessionSeedCmd,
    DassetsStripeListenerService,
    DassetsSyncerListenerService,
    DassetsEventsProcessorService,
  ],
  controllers: [DassetsController],
})
export class DassetsModule {}