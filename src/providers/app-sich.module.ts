import { getInternalContractData } from '@/helpers';
import { Injectable, Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Contract, providers, Signer, utils, Wallet } from 'ethers';
import { Connection } from 'mongoose';
import { chain_networks_list } from './chain-networks/chain-networks-list';
import { Sich } from '../libs/sich';
import { SichMongoDBAdapter } from '@/libs/sich';

@Injectable()
class SichProvider implements OnModuleDestroy, OnModuleInit {

  private logger = new Logger(SichProvider.name);

  constructor(
    private readonly sich: Sich,
  ) {}

  async onModuleDestroy() {
    await this.sich.stop();
  }

  onModuleInit() {

    if(process.env['ENABLE_SICH'] === 'true' && process.env['IS_BACKGROUND'] === 'true') {
      this.sich.start();
      this.logger.verbose('Sich started');
    }
  }
}

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
        const { address, abi } = getInternalContractData(contract_name, network.id);
        const contract = new Contract(address, abi, signer);

        return contract;
      }
    });

    const networks_whitelist = process.env['NETWORKS_WHITELIST']?.split(',') || [];

    for (const n of chain_networks_list) {

      if(!networks_whitelist.includes(n.id)) {
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
  providers: [ provider, SichProvider ],
})
export class AppSichModule {}
