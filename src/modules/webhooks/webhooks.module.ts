import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserSchema, WebhookModelModule } from '@/schemas';
import { WebhooksLoopService } from './services/webhooks-loop.service';
import { ArchiveWebhookModelModule } from '@/schemas/archive-webhook.schema';
import { WebhooksService } from './services/webhooks.service';

@Module({
  imports: [
    WebhookModelModule,
    ArchiveWebhookModelModule,
  ],
  providers: [
    WebhooksLoopService,
    WebhooksService,
  ],
  exports: [
    WebhooksService,
  ],
  controllers: [],
})
export class WebhooksModule {}