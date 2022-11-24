// sync dassets wimport { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DassetsNft, Project, User } from '@/schemas';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { ChainSyncerProvider } from '@/providers/chain-syncer';
import { WebhooksService } from '@/modules/webhooks/services/webhooks.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IDassetsNftMintedEvent } from '../interfaces/dassets-erc1155-nft-minted-event.interface';
import { IDassetsTransferSingleEvent } from '../interfaces/dassets-erc1155-transfer-single-event.interface';
import { IChainSyncerEventMetadata } from 'chain-syncer';

@Injectable()
export class DassetsSyncerListenerService implements OnModuleInit {


  constructor(
    private chsy_provider: ChainSyncerProvider,

    private event_emitter: EventEmitter2,
  ) {}

  async onModuleInit() {

    const chsy_instances = this.chsy_provider.selectAllInstances();

    for (const network in chsy_instances) {

      chsy_instances[network].on('!Dassets.NftMinted', async (
        mint_request_id: string,
        to: string, 
        id: string, 
        project_id: string,
        event_metadata: IChainSyncerEventMetadata,
      ) => {

        to = to.toLowerCase();
        const token_id = Number(id);
        project_id = utils.parseBytes32String(project_id);
        mint_request_id = utils.parseBytes32String(mint_request_id);

        await this.event_emitter.emitAsync(
          'dassets.nft-minted',
          {
            mint_request_id,
            to,
            token_id,
            project_id,
            event_metadata,
            network,
          } as IDassetsNftMintedEvent,
        );
      })


      chsy_instances[network].on('!Dassets.TransferSingle', async (
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

        await this.event_emitter.emitAsync(
          'dassets.transfer-single',
          {
            operator,
            from,
            to,
            token_id,
            value,
            event_metadata,
            network,
          } as IDassetsTransferSingleEvent,
        );
      })
    }
  }
}