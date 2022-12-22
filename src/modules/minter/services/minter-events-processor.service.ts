// sync minter wimport { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MinterCheckoutSession, MinterCheckoutSessionDocument, MinterNft, Project, QueuedSyncerEvent, SyncerInstance, TProjectDocument, TQueuedSyncerEventDocument, TSyncerInstanceDocument, User } from '@/schemas';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '@/modules/webhooks/services/webhooks.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IMinterNftMintedEvent } from '../interfaces/minter-erc1155-nft-minted-event.interface';
import { IMinterTransferSingleEvent } from '../interfaces/minter-erc1155-transfer-single-event.interface';
import { EventEmitterEventsService } from '@/modules/event-emitter/services/event-emitter-events.service';

@Injectable()
export class MinterEventsProcessorService {


  constructor(

    @InjectModel(Project.name)
    private project_model: Model<TProjectDocument>,

    @InjectModel(MinterNft.name)
    private dasset_nft_model: Model<MinterNft>,

    @InjectModel(SyncerInstance.name)
    private syncer_instance_model: Model<TSyncerInstanceDocument>,

    private readonly event_emitter_events_service: EventEmitterEventsService,
  ) {}

  @OnEvent('minter.nft-minted', { async: true })
  async handleErc1155NftMinted(payload: IMinterNftMintedEvent) {

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

    const nft_id = MinterNft.formatId(network, token_id);

    let nft = await this.dasset_nft_model.create({
      _id: nft_id,
      project: project_id,
      owner: to,
      mint_tx: event_metadata.transaction_hash,
      network: network,
      token_id: token_id,
      owner_synced_at: event_metadata.global_index,
      mint_request_id: mint_request_id,
    }).catch(err => err.code === 11000 ? this.dasset_nft_model.findOne({ _id: nft_id }) : err);

    if(!nft) {
      nft = await this.dasset_nft_model.findOne({
        _id: MinterNft.formatId(network, token_id),
      });
    }

    const event_id = utils.keccak256(utils.toUtf8Bytes(`${network}_${event_metadata.global_index}`));

    const event = {
      id: event_id,
      name: 'Minter.NftMinted',
      payload: nft.toObject(),
      metadata: event_metadata,
    };

    const syncer_instance = await this.syncer_instance_model.findOne({
      project: project.id,
      preset: 'minter',
    });

    await this.event_emitter_events_service.distribute(syncer_instance, event);

  }

  @OnEvent('minter.transfer-single', { async: true })
  async handleErc1155TransferSingle(payload: IMinterTransferSingleEvent) {

    const {
      network,
      token_id,
      event_metadata,
      operator,
      from,
      to,
      value,
    } = payload;

    const nft_id = MinterNft.formatId(network, token_id);

    const nft = await this.dasset_nft_model.findOne({
      _id: nft_id,
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

    const event_id = utils.keccak256(utils.toUtf8Bytes(`${network}_${event_metadata.global_index}`));

    const event = {
      id: event_id,
      name: 'Minter.NftTransferred',
      payload: nft.toObject(),
      metadata: event_metadata,
    };

    const syncer_instance = await this.syncer_instance_model.findOne({
      project: project.id,
      preset: 'minter',
    });

    await this.event_emitter_events_service.distribute(syncer_instance, event);
  }
}