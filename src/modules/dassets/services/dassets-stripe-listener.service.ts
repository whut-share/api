import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { DassetFlowSession, DassetFlowSessionDocument, ScanTarget, User, UserDocument } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { assemblyContractRoute, getContractsPath, getInternalContractData, typeToContractName } from '@/helpers';
import { IDassetsSessionCreate } from '../interfaces/dassets-session-create.interface';
import Stripe from 'stripe';
import { DassetsPriceEstimatorService } from './dassets-price-estimator.service';
import { merge } from 'lodash';
import { IDassetsSessionUpdate } from '../interfaces/dassets-session-update.interface';
import { IDassetsPriceEstimate } from '../interfaces/dassets-price-estimate.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { IStripeEvent } from '@/interfaces/stripe-event.interface';
import { DassetsMinterService } from './dassets-minter.service';

@Injectable()
export class DassetsStripeListenerService {


  constructor(
    @InjectModel(DassetFlowSession.name) 
    private dasset_flow_session_model: Model<DassetFlowSessionDocument>,

    private dassets_minter_service: DassetsMinterService,

    private stripe: Stripe,
  ) {}


  @OnEvent('stripe.payment_intent.succeeded')
  async handlePaymentIntentSuccseeded(payload: IStripeEvent<Stripe.PaymentIntent>) {

    const session_id = payload.data.metadata.dasset_flow_session_id;
    
    if(payload.data.metadata.type !== 'dasset-flow-session' || !session_id) {
      return;
    }

    const session = await this.dasset_flow_session_model.findOne({ _id: session_id });

    const contract_name = typeToContractName(session.contract_type);
    const res = await this.dassets_minter_service.mint(contract_name, 'mint', session.project);

    console.log(res);

  }
}