import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { DassetsCheckoutSession, DassetsCheckoutSessionDocument, DassetsCheckoutSessionPriceEstimate, Project, ProjectDocument, ScanTarget, User, UserDocument } from '@/schemas';
import Stripe from 'stripe';
import { DassetsCheckoutsPriceEstimatorService } from './dassets-checkouts-price-estimator.service';
import { merge } from 'lodash';
import { IDassetsCheckoutSessionUpdate } from '../interfaces/dassets-checkout-session-update.interface';
import { IDassetsCheckoutSessionCreate } from '../interfaces/dassets-checkout-session-create.interface';

@Injectable()
export class DassetsCheckoutsService {


  constructor(
    @InjectModel(DassetsCheckoutSession.name) 
    private dassets_checkout_session_model: Model<DassetsCheckoutSessionDocument>,

    @InjectModel(Project.name) 
    private project_model: Model<ProjectDocument>,

    private dassets_price_estimator_service: DassetsCheckoutsPriceEstimatorService,

    private stripe: Stripe,
  ) {}


  async create(user: UserDocument, data: IDassetsCheckoutSessionCreate) {

    const project = await this.project_model.findOne({ _id: data.project });

    if(project.user !== user.id) {
      throw new InvalidInputException('ACCESS_DENIED', 'You do not have access to this project');
    }

    return await this.dassets_checkout_session_model.create({
      project: data.project,
      contract_type: 'erc1155',
      expire_at: new Date(Date.now() + (3600 * 24 * 1000)),
      asset_info: data.asset_info,
    });
  }


  async estimatePrice(session: DassetsCheckoutSessionDocument): Promise<DassetsCheckoutSessionPriceEstimate> {
    return await this.dassets_price_estimator_service
      .estimate(session.network, session.contract_type);
  }


  async update(session: DassetsCheckoutSessionDocument, data: IDassetsCheckoutSessionUpdate) {

    const original = session.toObject();
    
    merge(session, data);

    return await session.save();

  }


  async getOrFail(id: string): Promise<DassetsCheckoutSessionDocument> {
    const session = await this.dassets_checkout_session_model.findOne({ _id: id });

    if(!session) {
      throw new InvalidInputException('NOT_FOUND', 'Session not found');
    }

    return session;
  }


  async delete(session: DassetsCheckoutSessionDocument) {
    await session.delete();
  }


  async createStripePaymentIntent(session: DassetsCheckoutSessionDocument) {

    const { price } = await this.dassets_price_estimator_service
      .estimate(session.network, session.contract_type);

    const pi = await this.stripe.paymentIntents.create({
      amount: Number(price.toFixed(2)) * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: 'dasset-checkout',
        session_id: session.id,
      },
    });


    return { client_secret: pi.client_secret };
  }
}