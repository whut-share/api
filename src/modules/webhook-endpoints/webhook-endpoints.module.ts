import { Module } from '@nestjs/common';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { DassetsNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserModelModule, UserSchema, WebhookEndpointModelModule, WebhookModelModule } from '@/schemas';
import { ArchiveWebhookModelModule } from '@/schemas/archive-webhook.schema';
import { WebhookEndpointsService } from './services/webhook-endpoints.service';
import { WebhookEndpointsResolver } from './webhook-endpoints.resolver';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthService } from '../auth/services/auth.service';

@Module({
  imports: [
    WebhookEndpointModelModule,
    ProjectModelModule,
    UserModelModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
    
    AuthService,

    WebhookEndpointsService,
    WebhookEndpointsResolver,
  ],
  exports: [
    WebhookEndpointsService,
  ],
  controllers: [],
})
export class WebhookEndpointsModule {}