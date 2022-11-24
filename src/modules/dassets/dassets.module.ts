import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetsCheckoutSessionModelModule, DassetsNftModelModule, ProjectModelModule, SyncerInstanceModelModule, User, UserModelModule, UserSchema, WebhookModelModule } from '@/schemas';
import { DassetsMigrateCmd } from './cmd/dassets-migrate.cmd';
import { DassetsMigratorService } from './services/dassets-migrator.service';
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
import { EventEmitterModule } from '../event-emitter/event-emitter.module';

@Module({
  imports: [
    ProjectModelModule,
    DassetsNftModelModule,
    ChainSyncerModule,
    WebhookModelModule,
    UserModelModule,
    StripeModule,
    AppSichModule,
    SyncerInstanceModelModule,
    EventEmitterModule,
  ],
  providers: [
    AuthService,
    DassetsMigrateCmd,
    DassetsMigratorService,
    DassetsMintCmd,
    DassetsMinterService,
    WebhooksService,
    DassetsSyncerListenerService,
    DassetsEventsProcessorService,
  ],
  controllers: [DassetsController],
})
export class DassetsModule {}