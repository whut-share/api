import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { chain_networks_list } from '@/providers/chain-networks';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';

import { ChainSyncer, IChainSyncerAdapter, IChainSyncerContractsGetterResult, IChainSyncerOptions } from 'chain-syncer';
import { MongoDBAdapter } from '@chainsyncer/mongodb-adapter';
import { Connection } from 'mongoose';
import { getConnectionToken, InjectConnection } from '@nestjs/mongoose';
import { assemblyContractRoute, getContractsPath } from '@/helpers';
import { IContractRoute } from '@/interfaces';
import { ChainNetworksProvider } from '../chain-networks/chain-networks.provider';

@Injectable()
export class ChainSyncerProvider implements OnModuleDestroy {

  private readonly logger = new Logger(ChainSyncerProvider.name);

  constructor(
    @InjectConnection() 
    private connection: Connection,

    private readonly chain_networks_provider: ChainNetworksProvider,
  ) {}


  private is_inited: boolean = false;
  private chsy: Record<string, ChainSyncer> = {};


  selectAllInstances() {

    if(!this.is_inited) {
      this.init();
    }

    return this.chsy;
  }


  init() {
    
    const chain_networks_list = this.chain_networks_provider.selectAll();

    let instances: Record<string, ChainSyncer> = {}
    for (const n of chain_networks_list) {

      const rpcs = {
        default: new Ethers.providers.JsonRpcProvider(n.default_rpc),
        archive: new Ethers.providers.JsonRpcProvider(n.archive_rpc),
      };

      const adapter: IChainSyncerAdapter = new MongoDBAdapter(this.connection.db, {
        prefix: `chsy_${n.id}_`
      });

      const opts: IChainSyncerOptions = {
        verbose: process.env['CHSY_VERBOSE'] === 'true',
        block_time: 3500,
        query_block_limit: 2000,
        ethers_provider: rpcs.default,
        logger: this.logger,
        mode: 'mono',

        async contractsGetter(contract: string, {
          archive_rpc_advised, 
          for_genesis_tx_lookup 
        }): Promise<IChainSyncerContractsGetterResult> {
          
          const provider = archive_rpc_advised ? rpcs.archive : rpcs.default;
          const is_inner_usage = contract.startsWith('!');
          contract = contract.replace('!', '');

          let inst: Ethers.Contract, deploy_transaction_hash: string;

          if(is_inner_usage) {
            const abi = JSON.parse(FS.readFileSync(getContractsPath(`abis/${contract}.json`), 'utf8'));
            const route: IContractRoute = JSON.parse(FS.readFileSync(getContractsPath(`routes/${assemblyContractRoute(contract, n.id)}.json`), 'utf8'));
            inst = new Ethers.Contract(route.address, abi, provider);
            deploy_transaction_hash = route.tx_hash;
          } else {
            // ...
          }

          return {
            deploy_transaction_hash,
            ethers_contract: inst,
          };
        },
      };

      const chsy = new ChainSyncer(adapter, opts);

      instances[n.id] = chsy;
    }

    this.chsy = instances;
    this.is_inited = true;
  }

  async onApplicationBootstrap() {
    if(process.env['ENABLE_CHSY'] === 'true' && process.env['IS_BACKGROUND'] === 'true') {
      for (const key in this.chsy) {
        this.logger.verbose(`Starting ChainSyncer for ${key} ...`);

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