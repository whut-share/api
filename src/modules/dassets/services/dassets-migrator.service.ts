import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { ScanTarget, User } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';

interface ContractRoute {
  key: string;
  contract: string;
  network: string;
  default_rpc: string;
  archive_rpc: string;
}

@Injectable()
export class DassetsMigratorService {


  constructor(
    private syncer_service: SyncerService,
  ) {}


  path(str: string) {
    return join(__dirname, './../../../../contracts', str)
  }


  async deployContract(contract: string, network: string, rpc: string) {
    
    const { bytecode } = JSON.parse(FS.readFileSync(this.path(`/binaries/${contract}.json`), 'utf8'));
    const abi = JSON.parse(FS.readFileSync(this.path(`/abis/${contract}.json`), 'utf8'));

    const provider = new Ethers.providers.JsonRpcProvider(rpc);
    
    const mnemonic_instance = Ethers.Wallet.fromMnemonic(process.env['MNEMONIC']);

    const wallet = new Ethers.Wallet(mnemonic_instance.privateKey, provider);

    const contract_factory = new Ethers.ContractFactory(abi, bytecode, wallet);

    const { address, deployTransaction } = await contract_factory.deploy('0x');

    return {
      address,
      tx_hash: deployTransaction.hash,
    }

  }


  async migrate(force = false) {
    
    const networks_whitelist = process.env['NETWORKS_WHITELIST']?.split(',') || [];
    const networks = networks_list.filter(n => networks_whitelist.includes(n.key));
    const routes: ContractRoute[] = networks.reduce<ContractRoute[]>((acc, n) => {
      return [ ...acc, {
        key: `${n.key}-erc1155`,
        contract: 'InteractERC1155',
        network: n.key,
        default_rpc: n.default_rpc,
        archive_rpc: n.archive_rpc,
      } ];
    }, []);

    for (const route of routes) {
      
      if(FS.existsSync(this.path(`/routes/${route}.json`)) && !force) {
        continue;
      }

      console.log('Migrating ...', route);

      const { tx_hash, address } = await this.deployContract(route.contract, route.network, route.default_rpc);

      console.log('Migrated ...', tx_hash, address, '\n\n-------\n');

      FS.writeFileSync(this.path(`/routes/${route.key}.json`), JSON.stringify({
        tx_hash,
        address,
        network: route.network,
        contract: route.contract,
      }, null, 2));
      
    }
  }
}