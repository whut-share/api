import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinterCheckoutSessionModelModule, MinterNftModelModule, ProjectModelModule, SyncerInstanceModelModule, User, UserModelModule, UserSchema, WebhookModelModule } from '@/schemas';
import { MinterMigrateCmd } from './cmd/minter-migrate.cmd';
import { MinterMigratorService } from './services/minter-migrator.service';
import { MinterSyncerListenerService } from './services/minter-syncer-listener.service';
import { MinterMintCmd } from './cmd/minter-mint.cmd';
import { MinterMinterService } from './services/minter-minter.service';
import { ChainSyncerModule, ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '../webhooks/services/webhooks.service';
import { MinterController } from './minter.controller';
import { StripeModule } from '../stripe/stripe.module';
import { AppSichModule } from '@/providers/app-sich.module';
import { AuthService } from '../auth/services/auth.service';
import { MinterEventsProcessorService } from './services/minter-events-processor.service';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { MinterNftsService } from './services/minter-nfts.service';
import { MinterNftsResolver } from './minter-nft.resolver';

@Module({
  imports: [
    ProjectModelModule,
    MinterNftModelModule,
    ChainSyncerModule,
    WebhookModelModule,
    UserModelModule,
    StripeModule,
    AppSichModule,
    SyncerInstanceModelModule,
    EventEmitterModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    AuthService,
    MinterMigrateCmd,
    MinterMigratorService,
    MinterMintCmd,
    MinterMinterService,
    WebhooksService,
    MinterSyncerListenerService,
    MinterEventsProcessorService,
    MinterNftsService,
    MinterNftsResolver,
  ],
  controllers: [MinterController],
})
export class MinterModule {}