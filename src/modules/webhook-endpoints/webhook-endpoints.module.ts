import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetsNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserSchema, WebhookEndpointModelModule, WebhookModelModule } from '@/schemas';
import { ArchiveWebhookModelModule } from '@/schemas/archive-webhook.schema';
import { WebhookEndpointsService } from './services/webhook-endpoints.service';

@Module({
  imports: [
    WebhookEndpointModelModule,
    ProjectModelModule,
  ],
  providers: [
    WebhookEndpointsService,
  ],
  exports: [
    WebhookEndpointsService,
  ],
  controllers: [],
})
export class WebhookEndpointsModule {}