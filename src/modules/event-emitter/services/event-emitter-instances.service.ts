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
import { EventEmitterHelpersService } from './event-emitter-helpers.service';

@Injectable()
export class EventEmitterInstancesService {


  constructor(
    @InjectModel(EventEmitterInstance.name)
    private event_emitter_instance_model: Model<TEventEmitterInstanceDocument>,

    @InjectModel(SyncerEvent.name)
    private syncer_event_model: Model<TSyncerEventDocument>,

    @InjectModel(SyncerEvent.name)
    private queued_syncer_event_model: Model<TQueuedSyncerEventDocument>,

    private event_emitter_helpers_service: EventEmitterHelpersService,

    private readonly syncer_helpers_service: SyncerHelpersService,
  ) {}

  async getOrFail(
    user: TUserDocument,
    id: string,
  ): Promise<TEventEmitterInstanceDocument> {

    const eei = await this.event_emitter_instance_model.findOne({
      _id: id,
    })

    if(!eei) {
      throw new InvalidInputException('NOT_FOUND', 'Entity not found');
    }

    return eei;
  }

  async create(
    user: TUserDocument, 
    data: IEventEmitterInstanceCreate,
  ): Promise<TEventEmitterInstanceDocument> {

    await this.syncer_helpers_service.hasAccessOrFail(data.syncer_instance, user);

    if(data.is_webhook_emitter && !data.webhook_endpoint) {
      throw new InvalidInputException('INVALID_INPUT', 'Webhook endpoint is required');
    }

    const eei = new this.event_emitter_instance_model({
      ...data,
    });

    eei.generateName();

    return await eei.save();
  }

  async select(
    user: TUserDocument, 
    filter: IEventEmitterInstancesFilter
  ): Promise<TEventEmitterInstanceDocument[]> {

    const query: any = {};

    if(filter.syncer_instance) {

      await this.syncer_helpers_service.hasAccessOrFail(filter.syncer_instance, user);

      merge(query, {
        syncer_instance: filter.syncer_instance
      })
    } else {
      const syncer_instance_ids = await this.syncer_helpers_service.getSyncerInstanceIdsByUser(user);

      merge(query, {
        syncer_instance: {
          $in: syncer_instance_ids,
        }
      })
    }

    if(filter.search) {
      merge(query, {
        name: {
          $regex: filter.search,
          $options: 'i',
        }
      })
    }

    if(filter.type) {
      if(filter.type === 'webhook') {
        merge(query, {
          is_webhook_emitter: true,
        })
      }
      else if(filter.type === 'stream') {
        merge(query, {
          is_webhook_emitter: false,
        })
      }
    }

    return await this.event_emitter_instance_model.find(query);
  }


  async update(
    user: TUserDocument,
    eei: TEventEmitterInstanceDocument, 
    data: IEventEmitterInstanceUpdate
  ): Promise<TEventEmitterInstanceDocument> {

    await this.event_emitter_helpers_service.hasAccessOrFail(eei, user);

    if(data.is_webhook_emitter && !data.webhook_endpoint) {
      throw new InvalidInputException('INVALID_INPUT', 'Webhook endpoint is required');
    }

    merge(eei, data);
    await eei.save();
    return eei;
  }


  async delete(
    user: TUserDocument, 
    eei: TEventEmitterInstanceDocument,
  ): Promise<void> {

    await this.event_emitter_helpers_service.hasAccessOrFail(eei._id, user);

    await this.syncer_event_model.deleteMany({
      event_emitter_instance: eei._id,
    });

    await this.queued_syncer_event_model.deleteMany({
      event_emitter_instance: eei._id,
    });

    await eei.remove();

  }
}