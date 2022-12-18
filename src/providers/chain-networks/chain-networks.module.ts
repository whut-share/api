import { Module } from '@nestjs/common';
import { ChainNetworksProvider } from './chain-networks.provider';
import { ChainNetworksResolver } from './chain-networks.resolver';

@Module({
  imports: [],
  exports: [
    ChainNetworksProvider,
  ],
  providers: [
    ChainNetworksProvider,
    ChainNetworksResolver,
  ],
})
export class ChainNetworksModule {}