import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { Project, TProjectDocument, User, TUserDocument } from '@/schemas';
import { chain_networks_list } from '@/providers/chain-networks';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';
import { merge } from 'lodash';
import { assemblyContractRoute } from '@/helpers';
import { IProjectCreate } from '../interfaces/project-create.interface';
import { IProjectUpdate } from '../interfaces/project-update.interface';
import { SyncerInstancesService } from '@/modules/syncer/services/syncer-instances.service';
import { KeyBunchesService } from '@/modules/key-bunches/services/key-bunches.service';


@Injectable()
export class ProjectsService {


  constructor(
    @InjectModel(Project.name) 
    private readonly project_model: Model<TProjectDocument>,

    private readonly syncer_instances_service: SyncerInstancesService,

    private readonly key_bunches_service: KeyBunchesService,
  ) {}


  async select(user: TUserDocument): Promise<TProjectDocument[]> {
    return await this.project_model.find({ user: user.id });
  }


  async getOrFail(user: TUserDocument, id: string): Promise<TProjectDocument> {

    const project = await this.project_model.findOne({ _id: id, user: user.id });

    if(!project) {
      throw new InvalidInputException('NOT_FOUND', 'Entity not found');
    }

    return project;
  }


  async create(
    user: TUserDocument, 
    data: IProjectCreate
  ): Promise<TProjectDocument> {
    const project = new this.project_model({
      ...data,
      user: user.id,
    });
    await project.save();

    await this.syncer_instances_service.create(user, {
      project: project.id,
      preset: 'dassets',
    });

    await this.key_bunches_service.create(user, {
      project: project.id,
      name: `${project.name.toLowerCase().replace(/ /g, '-')}_key-bunch`,
    })

    return project;
  }


  async update(
    user: TUserDocument, 
    id: string, 
    data: IProjectUpdate
  ): Promise<TProjectDocument> {
    
    const project = await this.getOrFail(user, id);

    merge(project, data);
    
    return await project.save();
  }
}