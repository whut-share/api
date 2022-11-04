// sync dassets wimport { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DassetFlowSession, DassetFlowSessionDocument, DassetNft, Project, ScanTarget, User } from '@/schemas';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '@/modules/webhooks/services/webhooks.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IDassetsErc1155NftMintedEvent } from '../interfaces/dassets-erc1155-nft-minted-event.interface';
import { IDassetsErc1155TransferSingleEvent } from '../interfaces/dassets-erc1155-transfer-single-event.interface';

@Injectable()
export class DassetsEventsProcessorService {


  constructor(

    @InjectModel(Project.name)
    private project_model: Model<Project>,

    @InjectModel(DassetNft.name)
    private dasset_nft_model: Model<DassetNft>,

    @InjectModel(DassetFlowSession.name)
    private dasset_flow_session_model: Model<DassetFlowSessionDocument>,

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

    const project = await this.project_model.findOne({
      _id: project_id,
    });

    let nft = await this.dasset_nft_model.create({
      _id: DassetNft.formatId(network, token_id),
      project: project_id,
      owner: to,
      mint_tx: event_metadata.transaction_hash,
      network: network,
      token_id: token_id,
      owner_synced_at: event_metadata.global_index,
      mint_request_id: mint_request_id,
    }).catch(err => err.code === 11000 ? null : err);

    if(!nft) {
      nft = await this.dasset_nft_model.findOne({
        _id: DassetNft.formatId(network, token_id),
      });
    }

    const d_session = await this.dasset_flow_session_model.findOne({
      _id: mint_request_id.replace('dflw_', ''),
    });

    const event_body = {
      type: 'dassets',
      name: 'NftMinted',
      nft: nft.toObject(),
      data: {
        to,
        project_id,
        token_id,
      },
      metadata: event_metadata,
    };

    await this.webhooks_service.addWebhook({
      url: project.dassets.webhook_events_url,
      data: event_body,
      project: project.id,
      event_id: utils.keccak256(utils.toUtf8Bytes(`${network}_${event_metadata.global_index}`)),
    });

    d_session.is_succeeded = true;
    d_session.mint_tx = event_metadata.transaction_hash;
    await d_session.save();
  }

  @OnEvent('dassets.erc1155.transfer-single', { async: true })
  async handleErc1155TransferSingle(payload: IDassetsErc1155TransferSingleEvent) {

    const {
      network,
      token_id,
      event_metadata,
      operator,
      from,
      to,
      value,
    } = payload;

    const nft = await this.dasset_nft_model.findOne({
      _id: DassetNft.formatId(network, token_id),
    });

    if(!nft) {
      return false;
    }

    await this.dasset_nft_model.updateOne({
      _id: nft.id,
      owner_synced_at: { $lt: event_metadata.global_index },
    }, {
      $set: {
        owner: to,
        owner_synced_at: event_metadata.global_index
      }
    });

    const project = await this.project_model.findOne({
      _id: nft.project,
    });

    const event_body = {
      type: 'dassets',
      name: 'TransferSingle',
      nft: nft.toObject(),
      body: {
        operator,
        from,
        to,
        token_id,
        value,
      },
      metadata: event_metadata,
    };

    await this.webhooks_service.addWebhook({
      url: project.dassets.webhook_events_url,
      data: event_body,
      event_id: utils.keccak256(utils.toUtf8Bytes(`${network}_${event_metadata.global_index}`)),
      project: project.id,
    });
  }
}