import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { ScanTarget, User, Webhook, WebhookDocument } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';
import { assemblyContractRoute } from '@/helpers';
import { WEBHOOK_MAX_ATTEMPTS } from '@/constants';
import { IWebhooksCreate } from '../interfaces/webhooks-create.interface';


@Injectable()
export class WebhooksService {

  constructor(
    @InjectModel(Webhook.name)
    private webhook_model: Model<WebhookDocument>,
  ) {}

  addWebhook(data: IWebhooksCreate) {
    const webhook = new this.webhook_model(data);
    return webhook.save();
  }
}