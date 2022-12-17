import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { ArchiveWebhook, ArchiveTWebhookDocument, User, Webhook, TWebhookDocument } from '@/schemas';
import { chain_networks_list } from '@/providers/chain-networks';
import Axios from 'axios';
import { join } from 'path';
import { assemblyContractRoute } from '@/helpers';
import { WEBHOOK_MAX_ATTEMPTS, WEBHOOK_TIMEOUT } from '@/constants';


@Injectable()
export class WebhooksLoopService implements OnModuleInit, OnModuleDestroy {

  private _timeout: any;
  private _pending_webhooks: string[] = [];

  constructor(
    @InjectModel(Webhook.name)
    private webhook_model: Model<TWebhookDocument>,

    @InjectModel(ArchiveWebhook.name)
    private archive_webhook_model: Model<ArchiveTWebhookDocument>,
  ) {}

  async onProcess(webhook: TWebhookDocument) {
    const res = await Axios.post(webhook.url, webhook.toObject(), {
      timeout: WEBHOOK_TIMEOUT,
    }).catch(err => err.response);

    if(res.status >= 400) {
      throw {
        body: res.data,
        code: res.status,
      }
    } else {
      return {
        body: res.data,
        code: res.status,
      }
    }
  }

  async onTick() {

    let webhooks_queue = await this.webhook_model.find({
      _id: { $nin: this._pending_webhooks }
    })

    if(!webhooks_queue.length) {
      return;
    }

    const webhook_ids = webhooks_queue.map(e => e.id);

    const responses = {};
    this._pending_webhooks.push(...webhook_ids);
    await Promise.all(
      webhooks_queue.map(n => (
        this.onProcess(n)
          .then(res => {
            const res_body = {
              type: 'success',
              body: res,
            };

            n.response_body = res;
            responses[n.id] = res_body;
          })
          .catch(err => {
            const res_body = {
              type: 'error',
              body: err,
            };

            n.response_body = err;
            responses[n.id] = res_body;
          })
          .finally(() => {
            this._pending_webhooks = this._pending_webhooks.filter(e => e !== n.id);
          })
      ))
    );

    const to_recreate = [];
    webhooks_queue.forEach(n => {
      
      if((n.attempt + 1) < WEBHOOK_MAX_ATTEMPTS && responses[n.id].type === 'error') {
        // TODO: check
        n.attempt += 1
        to_recreate.push(n.id)
      }
    });

    const webhooks_to_create = webhooks_queue
      .filter(n => to_recreate.includes(n.id))
      .map(n => {
        const object = n.toObject();
        delete object._id;
        return object;
      })
    
    if(webhooks_to_create.length) {
      await this.webhook_model.create(webhooks_to_create);
    }
    
    await this.webhook_model.deleteMany({
      _id: {
        $in: webhook_ids
      }
    });

    await this.archive_webhook_model.create(webhooks_queue.map(n => n.toObject()));

  }

  onModuleInit() {
    if(process.env['ENABLE_WEBHOOKS'] === 'true') {
      this._timeout = setInterval(this.onTick.bind(this), 4000);
    }
  }

  onModuleDestroy() {
    clearInterval(this._timeout);
  }
}