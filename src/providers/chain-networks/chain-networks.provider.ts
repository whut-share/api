import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { chain_networks_list } from '@/providers/chain-networks';

@Injectable()
export class ChainNetworksProvider {

  constructor(

  ) {}

  selectAll() {
    
    const networks_whitelist = process.env['NETWORKS_WHITELIST']?.split(',') || chain_networks_list.map(n => n.id);

    return chain_networks_list.filter(n => networks_whitelist.includes(n.id));
  }
}