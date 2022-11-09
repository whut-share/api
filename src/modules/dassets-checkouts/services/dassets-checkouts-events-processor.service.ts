// sync dassets wimport { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DassetsCheckoutSession, DassetsCheckoutSessionDocument, DassetsNft, Project, ScanTarget, User } from '@/schemas';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '@/modules/webhooks/services/webhooks.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IDassetsErc1155NftMintedEvent } from '@/modules/dassets/interfaces/dassets-erc1155-nft-minted-event.interface';

@Injectable()
export class DassetsCheckoutsEventsProcessorService {


  constructor(

    @InjectModel(Project.name)
    private project_model: Model<Project>,

    @InjectModel(DassetsNft.name)
    private dasset_nft_model: Model<DassetsNft>,

    @InjectModel(DassetsCheckoutSession.name)
    private dassets_checkout_session: Model<DassetsCheckoutSessionDocument>,

    private readonly webhooks_service: WebhooksService,
  ) {}

  @OnEvent('dassets.erc1155.nft-minted', { async: true })
  async handleErc1155NftMinted(payload: IDassetsErc1155NftMintedEvent) {

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