// sync dassets wimport { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { DassetNft, Project, ScanTarget, User } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { ChainSyncer } from 'chain-syncer';
import { BigNumber, utils } from 'ethers';
import Axios from 'axios';
import { ChainSyncerProvider } from '@/providers/chain-syncer';
import { sign } from 'web3-token';
import { WebhooksService } from '@/modules/webhooks/services/webhooks.service';

@Injectable()
export class DassetsListenerService implements OnModuleInit {


  constructor(
    private syncer_service: SyncerService,

    private chsy_provider: ChainSyncerProvider,

    @InjectModel(Project.name)
    private project_model: Model<Project>,

    @InjectModel(DassetNft.name)
    private dasset_nft_model: Model<DassetNft>,

    private readonly webhooks_service: WebhooksService,
  ) {}

  path(str: string) {
    return join(__dirname, './../../../../contracts', str)
  }

  async onModuleInit() {

    for (const network in this.chsy_provider.get()) {

      this.chsy_provider.get()[network].on('!InteractERC1155.NftMinted', async (
        to: string, 
        id: string, 
        project_id: string,
        event_metadata,
      ) => {

        to = to.toLowerCase();
        const token_id = Number(id);
        project_id = utils.parseBytes32String(project_id);

        const project = await this.project_model.findOne({
          _id: project_id,
        });

        let nft = await this.dasset_nft_model.create({
          _id: `${network}-${token_id}`,
          project: project_id,
          owner: to,
          mint_tx: event_metadata.transaction_hash,
          network: network,
          token_id: token_id,
          owner_synced_at: event_metadata.global_index
        }).catch(err => err.code === 11000 ? null : err);

        if(!nft) {
          nft = await this.dasset_nft_model.findOne({
            _id: `${network}-${token_id}`,
          });
        }

        await this.webhooks_service.addWebhook({
          url: project.dassets.webhook_events_url,
          data: {
            event: 'NftMinted',
            nft: nft.toObject(),
            event_data: {
              to,
              project_id,
              token_id,
            },
            event_metadata,
          },
          project: project.id,
        });
      })


      this.chsy_provider.get()[network].on('!InteractERC1155.TransferSingle', async (
        operator: string,
        from: string,
        to: string,
        id: string, 
        value: string,
        event_metadata,
      ) => {

        to = to.toLowerCase();
        operator = operator.toLowerCase();
        from = from.toLowerCase();
        const token_id = Number(id);

        const nft = await this.dasset_nft_model.findOne({
          _id: `${network}-${token_id}`,
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

        await this.webhooks_service.addWebhook({
          url: project.dassets.webhook_events_url,
          data: {
            event: 'TransferSingle',
            nft: nft.toObject(),
            event_data: {
              operator,
              from,
              to,
              token_id,
              value,
            },
            event_metadata,
          },
          project: project.id,
        });
      })
    }
  }
}