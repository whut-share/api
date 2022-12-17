import { Module } from '@nestjs/common';
import { ChainNetworksResolver } from './chain-networks.resolver';

@Module({
  imports: [],
  exports: [],
  providers: [
    ChainNetworksResolver
  ],
})
export class ChainNetworksModule {}