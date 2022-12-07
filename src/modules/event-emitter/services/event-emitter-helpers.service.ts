import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { EventEmitterInstance, Project, TProjectDocument, QueuedSyncerEvent, SyncerEvent, TEventEmitterInstanceDocument, TQueuedSyncerEventDocument, TSyncerEventDocument, User, TUserDocument, SyncerInstance, TSyncerInstanceDocument } from '@/schemas';
import { merge } from 'lodash';
import { IEventEmitterInstancesFilter } from '../interfaces/event-emitter-instances-filter.interface';
import { IEventEmitterInstanceCreate } from '../interfaces/event-emitter-instance-create.interface';
import { IEventEmitterInstanceUpdate } from '../interfaces/event-emitter-instance-update.interface';
import { SyncerInstancesService } from '@/modules/syncer/services/syncer-instances.service';
import { SyncerHelpersService } from '@/modules/syncer/services/syncer-helpers.service';

@Injectable()
export class EventEmitterHelpersService {


  constructor(
    @InjectModel(EventEmitterInstance.name)
    private event_emitter_instance_model: Model<TEventEmitterInstanceDocument>,

    private readonly syncer_helpers_service: SyncerHelpersService,
  ) {}


  async hasAccessOrFail(eei: TEventEmitterInstanceDocument | string, user: TUserDocument): Promise<void> {
    const syncer_instance_ids = await this.syncer_helpers_service.getSyncerInstanceIdsByUser(user);

    let is_failed = false;

    if( typeof eei === 'string') {
      const _eei = await this.event_emitter_instance_model.findOne({
        _id: eei,
        syncer_instance: {
          $in: syncer_instance_ids,
        }
      });

      if(!_eei) {
        is_failed = true;
      }
    } else {
      
      if(!syncer_instance_ids.includes(eei.syncer_instance)) {
        is_failed = true;
      }
    }

    if(is_failed) {
      throw new InvalidInputException('ACCESS_DENIED', 'Access denied');
    }
  }
}