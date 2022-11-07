import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { Project, ProjectDocument, ScanTarget, User, UserDocument } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { join } from 'path';
import { merge } from 'lodash';
import { assemblyContractRoute } from '@/helpers';
import { IProjectCreate } from '../interfaces/project-create.interface';
import { IProjectUpdate } from '../interfaces/project-update.interface';


@Injectable()
export class ProjectsService {


  constructor(
    @InjectModel(Project.name) 
    private readonly project_model: Model<ProjectDocument>,
  ) {}


  async select(user: UserDocument): Promise<ProjectDocument[]> {
    return await this.project_model.find({ user: user.id });
  }


  async getOrFail(user: UserDocument, id: string): Promise<ProjectDocument> {

    const project = await this.project_model.findOne({ _id: id, user: user.id });

    if(!project) {
      throw new InvalidInputException('NOT_FOUND', 'Entity not found');
    }

    return project;
  }


  async create(user: UserDocument, data: IProjectCreate): Promise<ProjectDocument> {
    const project = new this.project_model({
      ...data,
      user: user.id,
    });
    return await project.save();
  }


  async update(
    user: UserDocument, 
    id: string, 
    data: IProjectUpdate
  ): Promise<ProjectDocument> {
    
    const project = await this.getOrFail(user, id);

    merge(project, data);
    
    return await project.save();
  }
}