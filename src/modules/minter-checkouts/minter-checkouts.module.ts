import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { AppSichModule } from '@/providers/app-sich.module';
import { MinterCheckoutSessionModelModule, MinterNftModelModule, ProjectModelModule, UserModelModule } from '@/schemas';
import { Module } from '@nestjs/common';
import { AuthService } from '../auth/services/auth.service';
import { StripeModule } from '../stripe/stripe.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { MinterCheckoutsSessionSeedCmd } from './cmd/minter-checkouts-session-seed.cmd';
import { MinterCheckoutsEventsProcessorService } from './services/minter-checkouts-events-processor.service';
import { MinterCheckoutsPriceEstimatorService } from './services/minter-checkouts-price-estimator.service';
import { MinterCheckoutsStripeListenerService } from './services/minter-checkouts-stripe-listener.service';
import { MinterCheckoutsService } from './services/minter-checkouts.service';
import { MinterCheckoutsResolver } from './minter-checkouts.resolver';
import { MinterCheckoutsController } from './minter-checkouts.controller';

@Module({
  imports: [
    UserModelModule,
    ProjectModelModule,
    MinterNftModelModule,
    MinterCheckoutSessionModelModule,

    WebhooksModule,
    AppSichModule,
    StripeModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    AuthService,

    MinterCheckoutsEventsProcessorService,
    MinterCheckoutsPriceEstimatorService,
    MinterCheckoutsService,
    MinterCheckoutsSessionSeedCmd,
    MinterCheckoutsStripeListenerService,
    MinterCheckoutsResolver,
  ],
  // controllers: [MinterCheckoutsController],
})
export class MinterCheckoutsModule {}