// sync dassets wimport { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DassetNft, Project, ScanTarget, User } from '@/schemas';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '@/modules/webhooks/services/webhooks.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DassetsSyncerListenerService implements OnModuleInit {


  constructor(
    private chsy_provider: ChainSyncerProvider,

    private event_emitter: EventEmitter2,
  ) {}

  async onModuleInit() {

    const chsy_instances = this.chsy_provider.get();

    for (const network in chsy_instances) {

      chsy_instances[network].on('!InteractERC1155.NftMinted', async (
        to: string, 
        id: string, 
        project_id: string,
        event_metadata,
      ) => {

        to = to.toLowerCase();
        const token_id = Number(id);
        project_id = utils.parseBytes32String(project_id);

        this.event_emitter.emit(
          'dassets.erc1155.nft-minted',
          {
            to,
            token_id,
            project_id,
            event_metadata,
            network,
          }
        );
      })


      chsy_instances[network].on('!InteractERC1155.TransferSingle', async (
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

        this.event_emitter.emit(
          'dassets.erc1155.transfer-single',
          {
            operator,
            from,
            to,
            token_id,
            value,
            event_metadata,
            network,
          }
        );
      })
    }
  }
}