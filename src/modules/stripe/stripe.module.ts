import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinterNftModelModule, PersistentRecordModelModule, ProjectModelModule, User, UserSchema } from '@/schemas';
import { StripeMigratorService } from './services/stripe-migrator.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';

const stripe_provider = {
  provide: Stripe,
  useFactory: () => {
    return new Stripe(process.env['STRIPE_SK'], {
      // @ts-ignore
      apiVersion: '2022-08-01',
    });
  }
};

@Module({
  imports: [
    ProjectModelModule,
    PersistentRecordModelModule,
  ],
  providers: [
    StripeMigratorService,
    stripe_provider
  ],
  exports: [stripe_provider],
  controllers: [StripeController],
})
export class StripeModule {}