import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { DassetFlowSession, DassetFlowSessionDocument, ScanTarget, User, UserDocument } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { assemblyContractRoute, getContractsPath, getInternalContractData } from '@/helpers';
import { IDassetsSessionCreate } from '../interfaces/dassets-session-create.interface';
import Stripe from 'stripe';
import { DassetsPriceEstimatorService } from './dassets-price-estimator.service';
import { merge } from 'lodash';
import { IDassetsSessionUpdate } from '../interfaces/dassets-session-update.interface';
import { IDassetsPriceEstimate } from '../interfaces/dassets-price-estimate.interface';

@Injectable()
export class DassetsSessionService {


  constructor(
    @InjectModel(DassetFlowSession.name) 
    private dasset_flow_session_model: Model<DassetFlowSessionDocument>,

    private dassets_price_estimator_service: DassetsPriceEstimatorService,

    private stripe: Stripe,
  ) {}


  async create(user: UserDocument, data: IDassetsSessionCreate) {
    return await this.dasset_flow_session_model.create({
      project: data.project_id,
      contract_type: 'erc1155',
    });
  }


  async estimatePrice(session: DassetFlowSessionDocument): Promise<IDassetsPriceEstimate> {
    return await this.dassets_price_estimator_service
      .estimate(session.network, session.contract_type);
  }


  async update(session: DassetFlowSessionDocument, data: IDassetsSessionUpdate) {

    const original = session.toObject();
    
    merge(session, data);

    return await session.save();

  }


  async getOrFail(id: string): Promise<DassetFlowSessionDocument> {
    const session = await this.dasset_flow_session_model.findOne({ _id: id });

    if(!session) {
      throw new InvalidInputException('NOT_FOUND', 'Session not found');
    }

    return session;
  }


  async delete(session: DassetFlowSessionDocument) {
    await session.delete();
  }


  async createStripePaymentIntent(session: DassetFlowSessionDocument) {

    const { price } = await this.dassets_price_estimator_service
      .estimate(session.network, session.contract_type);

    const pi = await this.stripe.paymentIntents.create({
      amount: price,
      currency: "USD",
      automatic_payment_methods: {
        enabled: true,
      },
    });


    return {
      client_secret: pi.client_secret,
    };
  }
}