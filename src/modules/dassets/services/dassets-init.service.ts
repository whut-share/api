// sync dassets wimport { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { ScanTarget, User } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class DassetsInitService implements OnModuleInit {


  constructor(
    private syncer_service: SyncerService,
  ) {}

  path(str: string) {
    return join(__dirname, './../../../../contracts', str)
  }

  async onModuleInit() {

    const files = FS.readdirSync(this.path('routes'));

    const routes = files.map(f => {
      const {
        tx_hash,
        address,
        network,
        contract,
      } = JSON.parse(FS.readFileSync(this.path(`routes/${f}`), 'utf8'));
      return {
        tx_hash,
        address,
        network,
        contract,
      }
    });

    for (const n of routes) {

      let events: string[] = [];
      if(n.contract === 'InteractERC1155') {
        events = [
          'NftMinted',
          'TransferSingle',
          'TransferBatch',
        ];
      }
      else if(n.contract === 'InteractERC721') {
        throw new Error('ERC721 not supported yet');
      }
      else {
        throw new Error('Unknown contract');
      }

      await this.syncer_service.addScanTarget(null, {
        id: `dassets-${n.network}-${n.address}`,
        address: n.address,
        deploy_tx: n.tx_hash,
        network: n.network,
        is_inner_usage: true,
        events: events,
        contract_name: n.contract,
      }).catch(err => {
        if(err.code === 11000) {
          return;
        }
        throw err;
      });
    }
  }
}