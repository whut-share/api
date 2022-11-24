import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { EventEmitterInstance, Project, SyncerInstance, SyncerInstanceContract, TEventEmitterInstanceDocument, TProjectDocument, TSyncerInstanceDocument, TUserDocument, User } from '@/schemas';
import { ISyncerInstanceCreate } from '../interfaces/syncer-instance-create.interface';
import { EventEmitterInstancesService } from '@/modules/event-emitter/services/event-emitter-instances.service';
import { SyncerHelpersService } from './syncer-helpers.service';
import { ChainSyncerProvider } from '@/providers/chain-syncer';
import { getEventsFromAbi, smartMergeById } from '@/helpers';
import { ISyncerInstanceUpdate, ISyncerInstanceUpdateContracts } from '../interfaces/syncer-instance-update.interface';
import { merge } from 'lodash';
import { ISyncerInstancesFilter } from '../interfaces/syncer-instances-filter.interface';

@Injectable()
export class SyncerInstancesService {


  constructor(
    @InjectModel(Project.name)
    private project_model: Model<TProjectDocument>,

    @InjectModel(SyncerInstance.name)
    private syncer_instance_model: Model<TSyncerInstanceDocument>,

    @InjectModel(EventEmitterInstance.name)
    private event_emitter_instance_model: Model<TEventEmitterInstanceDocument>,

    private event_emitter_instances_service: EventEmitterInstancesService,

    private syncer_helpers_service: SyncerHelpersService,

    private chsy_provider: ChainSyncerProvider,
  ) {}


  async create(
    user: TUserDocument, 
    data: ISyncerInstanceCreate
  ): Promise<TSyncerInstanceDocument> {
    const syncer_instance = new this.syncer_instance_model(data);

    const project = await this.project_model.findOne({
      _id: data.project,
      user: user.id,
    });

    if(!project) {
      throw new InvalidInputException('ACCESS_DENIED', 'Access denied');
    }

    if(data.preset === 'dassets') {
      const dassets_syncer = await this.syncer_instance_model.findOne({
        project: project.id,
        preset: 'dassets',
      });

      if(dassets_syncer) {
        throw new InvalidInputException('DUPLICATE', 'Dassets syncer already exists');
      }
    } else {

      const chsy_instances = this.chsy_provider.selectAllInstances();
      
      for (const contract of syncer_instance.contracts) {
        const chsy = chsy_instances[contract.network];
        const events = getEventsFromAbi(contract.abi);

        const existing_events = await chsy.subscribers[0].events

        await chsy.updateSubscriber('mono', [
          ...existing_events,
          events.map(n => {
            return `${syncer_instance.id}-${contract.id}.${n}`
          })
        ]);
      }
    }

    return await syncer_instance.save();
  }


  async update(
    user: TUserDocument, 
    syncer_instance: TSyncerInstanceDocument,
    data: ISyncerInstanceUpdate,
  ): Promise<TSyncerInstanceDocument> {

    await this.syncer_helpers_service.hasAccessOrFail(syncer_instance, user);

    if(data.contracts && Array.isArray(data.contracts)) {
      syncer_instance.contracts = smartMergeById<SyncerInstanceContract>(syncer_instance.contracts, data.contracts);
      delete data.contracts;
    }

    merge(syncer_instance, data);

    return await syncer_instance.save();
  }


  async select(
    user: TUserDocument, 
    filter: ISyncerInstancesFilter
  ) {
    const query = {};

    if(filter.project) {
      merge(query, {
        project: filter.project,
      });
    } else {
      const projects = await this.project_model.find({
        user: user.id,
      });

      merge(query, {
        project: {
          $in: projects.map(n => n.id),
        }
      });
    }

    const result = await this.syncer_instance_model.find(query);

    return result;
  }


  async delete(
    user: TUserDocument, 
    syncer_instance: TSyncerInstanceDocument,
  ): Promise<void> {
    await this.syncer_helpers_service.hasAccessOrFail(syncer_instance, user);

    const eeis = await this.event_emitter_instance_model.find({
      syncer_instance: syncer_instance.id,
    });

    for(const eei of eeis) {
      await this.event_emitter_instances_service.delete(user, eei);
    }
  }


  async getOrFail(
    user: TUserDocument,
    syncer_instance_id: string,
  ): Promise<TSyncerInstanceDocument> {

    const syi = await this.syncer_instance_model.findOne({
      _id: syncer_instance_id,
    })

    if(!syi) {
      throw new InvalidInputException('NOT_FOUND', 'Entity not found');
    }

    return syi;
  }
}