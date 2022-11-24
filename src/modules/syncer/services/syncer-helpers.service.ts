import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { EventEmitterInstance, Project, SyncerInstance, TEventEmitterInstanceDocument, TProjectDocument, TSyncerInstanceDocument, TUserDocument, User } from '@/schemas';
import { ISyncerInstanceCreate } from '../interfaces/syncer-instance-create.interface';
import { EventEmitterInstancesService } from '@/modules/event-emitter/services/event-emitter-instances.service';

@Injectable()
export class SyncerHelpersService {


  constructor(
    @InjectModel(Project.name)
    private project_model: Model<TProjectDocument>,

    @InjectModel(SyncerInstance.name)
    private syncer_instance_model: Model<TSyncerInstanceDocument>,
  ) {}



  async hasAccessOrFail(syncer_instance: TSyncerInstanceDocument | string, user: TUserDocument): Promise<void> {
    const syncer_instance_ids = await this.getSyncerInstanceIdsByUser(user);

    const syncer_instance_id = typeof syncer_instance === 'string' ? syncer_instance : syncer_instance.id;

    if(!syncer_instance_ids.find(n => n === syncer_instance_id)) {
      throw new InvalidInputException('ACCESS_DENIED', 'Access denied');
    }
  }


  async getSyncerInstanceIdsByUser(user: TUserDocument): Promise<string[]> {

    const project_ids = await this.project_model.find({
      user: user.id,
    }).select('_id');

    const user_syncer_instance_ids = await this.syncer_instance_model.find({
      project: {
        $in: project_ids,
      }
    }).select('_id').then(docs => docs.map(d => d.id));

    return user_syncer_instance_ids;
  }
}