import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';

import { ChainSyncer } from 'chain-syncer';
import { MongoDBAdapter } from '@chainsyncer/mongodb-adapter';
import { Connection } from 'mongoose';
import { getConnectionToken, InjectConnection } from '@nestjs/mongoose';
import { assemblyContractRoute } from '@/helpers';

function path(str: string) {
  return join(__dirname, '../../../contracts', str)
}

@Injectable()
export class ChainSyncerProvider implements OnModuleDestroy {


  constructor(
    @InjectConnection() 
    private connection: Connection,
  ) {}


  private is_inited: boolean = false;
  private chsy: Record<string, any> = {};

  path(str: string) {
    return join(__dirname, './../../../../contracts', str)
  }


  get() {

    if(!this.is_inited) {
      this.init();
    }

    return this.chsy;
  }


  init() {
    
    const networks_whitelist = process.env['NETWORKS_WHITELIST']?.split(',') || [];

    let instances = {}
    for (const n of networks_list) {

      if(!networks_whitelist.includes(n.key)) {
        continue;
      }

      const rpcs = {
        default: new Ethers.providers.JsonRpcProvider(n.default_rpc),
        archive: new Ethers.providers.JsonRpcProvider(n.archive_rpc),
      };

      const chsy = new ChainSyncer(
        new MongoDBAdapter(this.connection.db, {
          prefix: `chsy_${n.key}_`
        }),
        {
          verbose: process.env['CHSY_VERBOSE'] === 'true',
          block_time: 3500,
          query_block_limit: 2000,
          ethers_provider: rpcs.default,
  
          async contractsGetter(contract: string, {
            archive_rpc_advised, 
            for_genesis_tx_lookup 
          }) {
            
            const provider = archive_rpc_advised ? rpcs.archive : rpcs.default;
            const is_inner_usage = contract.startsWith('!');
            contract = contract.replace('!', '');

            let inst, deployed_transaction_hash;
  
            if(is_inner_usage) {
              const abi = JSON.parse(FS.readFileSync(path(`abis/${contract}.json`), 'utf8'));
              const route = JSON.parse(FS.readFileSync(path(`routes/${assemblyContractRoute(contract, n.key)}.json`), 'utf8'));
              inst = new Ethers.Contract(route.address, abi, provider);
              deployed_transaction_hash = route.tx_hash;
            } else {
              // ...
            }
  
            return {
              deployed_transaction_hash,
              inst,
            };
          },
        }
      );

      instances[n.key] = chsy;
    }

    this.chsy = instances;
    this.is_inited = true;
  }

  async onApplicationBootstrap() {
    if(process.env['ENABLE_CHSY'] === 'true') {
      for (const key in this.chsy) {
        console.log(`Starting ChainSyncer for ${key} ...`);
        await this.chsy[key].start();
      }
    }
  }

  onModuleDestroy() {
    for (const key in this.chsy) {
      this.chsy[key].stop();
    }
  }
}