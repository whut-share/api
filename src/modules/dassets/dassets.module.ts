import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetsCheckoutSessionModelModule, DassetsNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserModelModule, UserSchema, WebhookModelModule } from '@/schemas';
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
import { AuthService } from '../auth/services/auth.service';
import { DassetsEventsProcessorService } from './services/dassets-events-processor.service';

@Module({
  imports: [
    ScanTargetModelModule,
    ProjectModelModule,
    DassetsNftModelModule,
    ChainSyncerModule,
    WebhookModelModule,
    UserModelModule,
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
    DassetsSyncerListenerService,
    DassetsEventsProcessorService,
  ],
  controllers: [DassetsController],
})
export class DassetsModule {}