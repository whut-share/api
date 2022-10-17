import { Module, DynamicModule, Global } from '@nestjs/common';
import { ChainSyncer } from 'chain-syncer';
import { MongoDBAdapter } from '@chainsyncer/mongodb-adapter';
import { Connection } from 'mongoose';
import { getConnectionToken, InjectConnection } from '@nestjs/mongoose';
import { ethers as Ethers } from 'ethers';
import { networks_list } from './networks/networks-list';
import * as FS from 'fs'
import { join } from 'path';

function path(str: string) {
  return join(__dirname, '../../contracts', str)
}

const provider = {
  provide: 'ChainSyncer',
  inject: [
    getConnectionToken(),
  ],
  useFactory(connection) {

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
        new MongoDBAdapter(connection),
        {
          // verbose: true,
          block_time: 3500,
          query_block_limit: 2000,
          ethers_provider: rpcs.default,
  
          async contractsGetter(contract: string, {
            archive_rpc_advised, 
            for_genesis_tx_lookup 
          }) {

            const routes_mappings = {
              'InteractERC1155': 'erc1155',
            }
            
            const provider = archive_rpc_advised ? rpcs.archive : rpcs.default;
            const is_inner_usage = contract.startsWith('!');
            contract = contract.replace('!', '');

            let inst, deployed_transaction_hash;
  
            if(is_inner_usage) {
              const abi = JSON.parse(FS.readFileSync(path(`abis/${contract}.json`), 'utf8'));
              const route = JSON.parse(FS.readFileSync(path(`routes/${n.key}-${routes_mappings[contract]}.json`), 'utf8'));
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

    return instances;
  },
};

@Global()
@Module({
  providers: [
    provider,  
  ],
  exports: [
    provider,
  ],
})
export class AppChSyModule {}