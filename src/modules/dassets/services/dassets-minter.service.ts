import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { ScanTarget, User } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { assemblyContractRoute, getContractsPath, getInternalContractData } from '@/helpers';


@Injectable()
export class DassetsMinterService {


  constructor(

  ) {}


  async mint(
    contract_name: string, 
    network: string, 
    project_id: string, 
    owner_address?: string
  ) {
    
    const { address, abi } = getInternalContractData(contract_name, network);
    const rpc = networks_list.find(n => n.key === network).archive_rpc;

    const provider = new Ethers.providers.JsonRpcProvider(rpc);
    
    const mnemonic_instance = Ethers.Wallet.fromMnemonic(process.env['MNEMONIC']);

    const wallet = new Ethers.Wallet(mnemonic_instance.privateKey, provider);

    const contract = new Ethers.Contract(address, abi, wallet);

    await contract.setMintPermission(wallet.address, true);
    // return await contract.mint(owner_address || wallet.address, Ethers.utils.formatBytes32String(project_id), 1, '0x');
  }
}