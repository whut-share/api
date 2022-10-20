import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { ScanTarget, User } from '@/schemas';
import { ChainSyncer } from 'chain-syncer';
import { ChainSyncerProvider } from '@/providers/chain-syncer';

@Injectable()
export class SyncerInitService implements OnModuleInit {


  constructor(
    @InjectModel(ScanTarget.name)
    private scan_target_model: Model<ScanTarget>,

    private chsy_provider: ChainSyncerProvider,
  ) {}


  async onModuleInit() {
    const targets = await this.scan_target_model.find({});

    for (const t of targets) {

      for (const event of t.events) {
        if(t.is_inner_usage) {
          // ...
        } else {
          this.chsy_provider.get()[t.network].on(`${t.address}.${event}`, () => {
            console.log('external usage', t.network, t.address, event);
          });
        }
      }
    }
  }
}