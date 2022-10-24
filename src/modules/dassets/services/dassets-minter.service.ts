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
import { assemblyContractRoute } from '@/helpers';


@Injectable()
export class DassetsMinterService {


  constructor(

  ) {}


  path(str: string) {
    return join(__dirname, './../../../../contracts', str)
  }


  async mint(contract_name: string, network: string, project_id: string) {
    const abi = JSON.parse(FS.readFileSync(this.path(`/abis/${contract_name}.json`), 'utf8'));
    const route = JSON.parse(FS.readFileSync(this.path(`/routes/${assemblyContractRoute(contract_name, network)}.json`), 'utf8'));
    const rpc = networks_list.find(n => n.key === network).archive_rpc;

    const provider = new Ethers.providers.JsonRpcProvider(rpc);
    
    const mnemonic_instance = Ethers.Wallet.fromMnemonic(process.env['MNEMONIC']);

    const wallet = new Ethers.Wallet(mnemonic_instance.privateKey, provider);

    const contract = new Ethers.Contract(route.address, abi, wallet);

    // await contract.setMintPermission(wallet.address, true);
    return await contract.mint(wallet.address, Ethers.utils.formatBytes32String(project_id), 1, '0x');
  }
}