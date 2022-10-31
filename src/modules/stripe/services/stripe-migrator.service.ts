import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { PersistentRecord, PersistentRecordDocument, Project, ProjectDocument, ScanTarget, User, UserDocument } from '@/schemas';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';
import { merge } from 'lodash';
import { assemblyContractRoute } from '@/helpers';
import Stripe from 'stripe';
import { STRIPE_PRICES_MIGRATE_DATA, STRIPE_PRODUCTS_MIGRATE_DATA } from '../migrate-data';

@Injectable()
export class StripeMigratorService implements OnModuleInit {

  constructor(

    private stripe: Stripe,

    @InjectModel(PersistentRecord.name)
    private persistent_record: Model<PersistentRecordDocument>,
  ) {}

  async migrateWebhooks() {
    const list = await this.stripe.webhookEndpoints.list({
      limit: 100,
    });

    if(list.has_more) {
      throw new Error('Too many stripe webhooks');
    }

    const needed_webhook = list.data.find(webhook => (new RegExp(process.env['APP_URL'])).test(webhook.url));

    if(!needed_webhook) {
      const wh = await this.stripe.webhookEndpoints.create({
        url: `${process.env['APP_URL']}/stripe/webhooks`,
        enabled_events: [ '*' ],
      });

      const secret = await this.persistent_record.findOne({ _id: 'stripe-webhook-secret' });

      if(secret) {
        await secret.delete();
      }

      await this.persistent_record.create({
        _id: 'stripe-webhook-secret',
        value: wh.secret,
      });
    } else {

      const secret = await this.persistent_record.findOne({ _id: 'stripe-webhook-secret' });

      if(!secret) {
        await this.stripe.webhookEndpoints.del(needed_webhook.id);
        await this.migrateWebhooks();
      }
    }
  }


  async _getProjects() {
    const products = await this.stripe.products.list({
      limit: 100,
    });

    if(products.has_more) {
      throw new Error('Too many stripe products');
    }

    return products.data;
  }


  async migrateProducts() {
    const products = await this._getProjects()

    for (const key in STRIPE_PRODUCTS_MIGRATE_DATA) {
      if(!products.find(n => n.name === key)) {
        await this.stripe.products.create(STRIPE_PRODUCTS_MIGRATE_DATA[key]);
      }
    }
  }


  async migratePrices() {
    
    const products = await this._getProjects();

    for (const key in STRIPE_PRICES_MIGRATE_DATA) {
      
      const product = products.find(n => n.name === key);

      if(!product) {
        throw new Error(`Product ${key} not found`);
      }

      const prices = await this.stripe.prices.list({
        limit: 100,
        product: product.id,
      });

      if(prices.has_more) {
        throw new Error('Too many stripe prices');
      }

      const needed_price = STRIPE_PRICES_MIGRATE_DATA[key];

      if(!prices.data.find(n => n.nickname === needed_price.nickname)) {

        await this.stripe.prices.create({
          nickname: needed_price.nickname,
          currency: 'USD',
          product: product.id,
          unit_amount: needed_price.unit_amount,
          recurring: {
            interval: needed_price.recurring_interval,
            usage_type: needed_price.recurring_usage_type,
          }
        });
      }

    }
    
  }


  async onModuleInit() {
    
    if(process.env['STRIPE_MIGRATE'] === 'true' && process.env['IS_BACKGROUND'] === 'true') {

      await this.migrateWebhooks();
      await this.migrateProducts();
      await this.migratePrices();
    }
  }
}