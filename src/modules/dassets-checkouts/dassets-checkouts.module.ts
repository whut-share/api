import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { AppSichModule } from '@/providers/app-sich.module';
import { DassetsCheckoutSessionModelModule, DassetsNftModelModule, ProjectModelModule, UserModelModule } from '@/schemas';
import { Module } from '@nestjs/common';
import { AuthService } from '../auth/services/auth.service';
import { StripeModule } from '../stripe/stripe.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { DassetsCheckoutsSessionSeedCmd } from './cmd/dassets-checkouts-session-seed.cmd';
import { DassetsCheckoutsEventsProcessorService } from './services/dassets-checkouts-events-processor.service';
import { DassetsCheckoutsPriceEstimatorService } from './services/dassets-checkouts-price-estimator.service';
import { DassetsCheckoutsStripeListenerService } from './services/dassets-checkouts-stripe-listener.service';
import { DassetsCheckoutsService } from './services/dassets-checkouts.service';
import { DassetsCheckoutsResolver } from './dassets-checkouts.resolver';
import { DassetsCheckoutsController } from './dassets-checkouts.controller';

@Module({
  imports: [
    UserModelModule,
    ProjectModelModule,
    DassetsNftModelModule,
    DassetsCheckoutSessionModelModule,

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

    DassetsCheckoutsEventsProcessorService,
    DassetsCheckoutsPriceEstimatorService,
    DassetsCheckoutsService,
    DassetsCheckoutsSessionSeedCmd,
    DassetsCheckoutsStripeListenerService,
    DassetsCheckoutsResolver,
  ],
  controllers: [DassetsCheckoutsController],
})
export class DassetsCheckoutsModule {}