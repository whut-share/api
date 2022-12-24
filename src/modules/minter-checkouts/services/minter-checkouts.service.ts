import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { MinterCheckoutSession, MinterCheckoutSessionDocument, MinterCheckoutSessionPriceEstimate, Project, TProjectDocument, User, TUserDocument } from '@/schemas';
import Stripe from 'stripe';
import { MinterCheckoutsPriceEstimatorService } from './minter-checkouts-price-estimator.service';
import { merge } from 'lodash';
import { IMinterCheckoutSessionUpdate } from '../interfaces/minter-checkout-session-update.interface';
import { IMinterCheckoutSessionCreate } from '../interfaces/minter-checkout-session-create.interface';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MinterCheckoutsService {


  constructor(
    @InjectModel(MinterCheckoutSession.name) 
    private minter_checkout_session_model: Model<MinterCheckoutSessionDocument>,

    @InjectModel(Project.name) 
    private project_model: Model<TProjectDocument>,

    private minter_price_estimator_service: MinterCheckoutsPriceEstimatorService,

    private stripe: Stripe,
  ) {}


  @Cron('* * * * * *')
  async resetExpiredPayments() {
    
    await this.minter_checkout_session_model.updateMany({
      payment_expires_at: {
        $lte: new Date(),
      },
    }, {
      $set: {
        payment_expires_at: null,
        payment_id: null,
      }
    });
  }


  async create(user: TUserDocument, data: IMinterCheckoutSessionCreate) {

    const project = await this.project_model.findOne({ _id: data.project });

    if(project.user !== user.id) {
      throw new InvalidInputException('ACCESS_DENIED', 'You do not have access to this project');
    }

    return await this.minter_checkout_session_model.create({
      project: data.project,
      contract_type: 'erc1155',
      expires_at: new Date(Date.now() + (3600 * 24 * 1000)),
      asset_info: data.asset_info,
    });
  }


  async estimatePrice(session: MinterCheckoutSessionDocument): Promise<MinterCheckoutSessionPriceEstimate> {
    return await this.minter_price_estimator_service
      .estimate(session.network, session.contract_type);
  }


  async update(session: MinterCheckoutSessionDocument, data: IMinterCheckoutSessionUpdate) {

    const original = session.toObject();
    
    merge(session, data);

    return await session.save();

  }


  async getOrFail(id: string): Promise<MinterCheckoutSessionDocument> {
    const session = await this.minter_checkout_session_model.findOne({ _id: id });

    if(!session) {
      throw new InvalidInputException('NOT_FOUND', 'Session not found');
    }

    return session;
  }


  async delete(session: MinterCheckoutSessionDocument) {
    await session.delete();
  }


  async attachStripePaymentIntent(session: MinterCheckoutSessionDocument): Promise<MinterCheckoutSessionDocument> {
    const { price } = await this.minter_price_estimator_service
      .estimate(session.network, session.contract_type);

    const pi = await this.stripe.paymentIntents.create({
      amount: Number(price.toFixed(2)) * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: 'minter-checkout',
        session_id: session.id,
      },
    });

    session.stripe_pi_client_secret = pi.client_secret;
    session.payment_id = pi.id;
    session.payment_expires_at = new Date(Date.now() + (60 * 5 * 1000));
    await session.save();

    return session;
  }
}