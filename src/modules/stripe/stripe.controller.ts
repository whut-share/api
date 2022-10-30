import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PersistentRecord, PersistentRecordDocument, User } from '@/schemas';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('stripe')
export class StripeController {

  constructor(
    private event_emitter: EventEmitter2,

    private stripe: Stripe,

    @InjectModel(PersistentRecord.name)
    private persistent_record: Model<PersistentRecordDocument>,
  ) {}

  async getSecret(): Promise<string> {
    const record = await this.persistent_record.findOne({
      _id: 'stripe-webhook-secret',
    });

    return record.value;
  }

  @Post('webhooks')
  async webhooks(@Body() body, @Req() req: Request) {

    const sig = req.headers['stripe-signature'];
    const secret = await this.getSecret();
    const event = this.stripe.webhooks.constructEvent(JSON.stringify(body), sig, secret);

    this.event_emitter.emit(
      'stripe.' + event.type,
      {
        data: event.data,
        evt_id: event.id,
      },
    );
  }
}