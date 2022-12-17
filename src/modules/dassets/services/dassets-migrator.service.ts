import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { User } from '@/schemas';
import { chain_networks_list } from '@/providers/chain-networks';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';
import { getContractsPath } from '@/helpers';

interface ContractRoute {
  key: string;
  contract: string;
  network: string;
  default_rpc: string;
  archive_rpc: string;
}

@Injectable()
export class DassetsMigratorService {

  private readonly logger = new Logger(DassetsMigratorService.name);

  constructor(

  ) {}


  async deployContract(contract_name: string, network: string, rpc: string) {
    
    const { bytecode } = JSON.parse(FS.readFileSync(getContractsPath(`binaries/${contract_name}.json`), 'utf8'));
    const abi = JSON.parse(FS.readFileSync(getContractsPath(`abis/${contract_name}.json`), 'utf8'));

    const provider = new Ethers.providers.JsonRpcProvider(rpc);
    
    const mnemonic_instance = Ethers.Wallet.fromMnemonic(process.env['MNEMONIC']);

    const wallet = new Ethers.Wallet(mnemonic_instance.privateKey, provider);

    const contract_factory = new Ethers.ContractFactory(abi, bytecode, wallet);

    const { address, deployTransaction } = await contract_factory.deploy('0x');
    await deployTransaction.wait();

    const contract = new Ethers.Contract(address, abi, wallet);
    
    const permission_tx = await contract.setMintPermission(wallet.address, true);
    await permission_tx.wait();

    return {
      address,
      tx_hash: deployTransaction.hash,
    }

  }


  async migrate(force = false) {
    
    const networks_whitelist = process.env['NETWORKS_WHITELIST']?.split(',') || [];
    const networks = chain_networks_list.filter(n => networks_whitelist.includes(n.key));
    const routes: ContractRoute[] = networks.reduce<ContractRoute[]>((acc, n) => {
      return [ ...acc, {
        key: `${n.key}-erc1155`,
        contract: 'Dassets',
        network: n.key,
        default_rpc: n.default_rpc,
        archive_rpc: n.archive_rpc,
      } ];
    }, []);

    for (const route of routes) {
      
      if(FS.existsSync(getContractsPath(`routes/${route}.json`)) && !force) {
        continue;
      }

      this.logger.verbose('Migrating ...', route);

      const { tx_hash, address } = await this.deployContract(route.contract, route.network, route.default_rpc);

      this.logger.verbose('Migrated ...', tx_hash, address, '\n\n-------\n');

      FS.writeFileSync(getContractsPath(`routes/${route.key}.json`), JSON.stringify({
        tx_hash,
        address,
        network: route.network,
        contract: route.contract,
      }, null, 2));
      
    }
  }
}