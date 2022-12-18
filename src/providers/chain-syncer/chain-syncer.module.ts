import { Module, DynamicModule, Global } from '@nestjs/common';
import { ChainSyncer } from 'chain-syncer';
import { MongoDBAdapter } from '@chainsyncer/mongodb-adapter';
import { Connection } from 'mongoose';
import { getConnectionToken, InjectConnection } from '@nestjs/mongoose';
import { ethers as Ethers } from 'ethers';
import * as FS from 'fs'
import { join } from 'path';
import { ChainSyncerProvider } from './chain-syncer.provider';
import { ChainNetworksModule } from '../chain-networks';

@Module({
  imports: [
    ChainNetworksModule,
  ],
  providers: [
    ChainSyncerProvider,
  ],
  exports: [
    ChainSyncerProvider,
  ],
})
export class ChainSyncerModule {}