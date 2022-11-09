import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { DassetsCheckoutSession, DassetsCheckoutSessionDocument, ScanTarget, User, UserDocument } from '@/schemas';
import * as Ethers from 'ethers';
import { assemblyContractRoute, getContractsPath, getInternalContractData, typeToContractName } from '@/helpers';
import Stripe from 'stripe';
import { OnEvent } from '@nestjs/event-emitter';
import { IStripeEvent } from '@/interfaces/stripe-event.interface';
import { Sich } from '@/libs/sich';

@Injectable()
export class DassetsCheckoutsStripeListenerService {


  constructor(
    @InjectModel(DassetsCheckoutSession.name) 
    private da_checkout_session: Model<DassetsCheckoutSessionDocument>,

    private sich: Sich,
  ) {}


  @OnEvent('stripe.payment_intent.succeeded', { async: true })
  async handlePaymentIntentSuccseeded(payload: IStripeEvent<Stripe.PaymentIntent>) {
    
    const session_id = payload.data.metadata.session_id;
    
    if(payload.data.metadata.type !== 'dasset-checkout' || !session_id) {
      return;
    }

    const session = await this.da_checkout_session.findOne({ _id: session_id });

    const contract_name = typeToContractName(session.contract_type);

    const request_id = Ethers.utils.formatBytes32String('dflw_' + session.id);

    await this.sich.callJob({
      id: payload.evt_id,
      contract_name,
      method: 'mint',
      args: [
        request_id,
        session.address, 
        Ethers.utils.formatBytes32String(session.project), 
        1, 
        '0x',
      ],
      network: session.network,
    });
    
    session.payment_id = payload.data.id;
    await session.save();

  }
}