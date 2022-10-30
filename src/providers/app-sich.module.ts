import { getInternalContractData } from '@/helpers';
import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Contract, providers, Signer, utils, Wallet } from 'ethers';
import { Connection } from 'mongoose';
import { networks_list } from './networks/networks-list';
import { Sich } from './sich';
import { SichMongoDBAdapter } from './sich/adapter';

const mnemonic_instance = Wallet.fromMnemonic(process.env['MNEMONIC']);

const provider = {
  provide: Sich,
  useFactory: (connection: Connection) => {

    const sich = new Sich(new SichMongoDBAdapter(connection.db), {
      async contractsGetter(contract_name, network) {
        const provider = new providers.JsonRpcProvider(network.rpc);
        const signer = new Wallet(
          mnemonic_instance.privateKey, 
          provider
        );
        const { address, abi } = getInternalContractData(contract_name, network.key);
        const contract = new Contract(address, abi, signer);

        return contract;
      }
    });

    const networks_whitelist = process.env['NETWORKS_WHITELIST']?.split(',') || [];

    for (const n of networks_list) {

      if(!networks_whitelist.includes(n.key)) {
        continue;
      }

      sich.addNetwork({
        ...n,
        rpc: n.archive_rpc,
      });
    }

    return sich;
  },
  inject: [
    getConnectionToken(),
  ],
}

@Module({
  imports: [],
  exports: [ provider ],
  providers: [ provider ],
})
export class AppSichModule {}
