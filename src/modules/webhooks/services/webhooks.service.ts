import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { User, Webhook, TWebhookDocument } from '@/schemas';
import { join } from 'path';
import { assemblyContractRoute } from '@/helpers';
import { WEBHOOK_MAX_ATTEMPTS } from '@/constants';
import { IWebhookCreate } from '../interfaces/webhook-create.interface';


@Injectable()
export class WebhooksService {

  constructor(
    @InjectModel(Webhook.name)
    private webhook_model: Model<TWebhookDocument>,
  ) {}

  create(data: IWebhookCreate) {
    const webhook = new this.webhook_model(data);
    return webhook.save();
  }
}