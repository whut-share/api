import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DassetsCheckoutSession, DassetsCheckoutSessionDocument } from '@/schemas';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IDassetsNftMintedEvent } from '@/modules/dassets/interfaces/dassets-erc1155-nft-minted-event.interface';

@Injectable()
export class DassetsCheckoutsEventsProcessorService {


  constructor(

    @InjectModel(DassetsCheckoutSession.name)
    private dassets_checkout_session: Model<DassetsCheckoutSessionDocument>,
  ) {}

  @OnEvent('dassets.nft-minted', { async: true })
  async handleErc1155NftMinted(payload: IDassetsNftMintedEvent) {

    const {
      mint_request_id,
      project_id,
      network,
      token_id,
      event_metadata,
      to,
    } = payload;

    const d_session = await this.dassets_checkout_session.findOne({
      _id: mint_request_id.replace('dflw_', ''),
    });

    d_session.is_succeeded = true;
    d_session.mint_tx = event_metadata.transaction_hash;
    d_session.mint_token_id = token_id;
    await d_session.save();
  }
}