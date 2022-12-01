import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { Project, TProjectGroupDocument, User, TUserDocument, ProjectGroup } from '@/schemas';
import { networks_list } from '@/providers/networks/networks-list';
import { merge } from 'lodash';
import { assemblyContractRoute } from '@/helpers';
import { IProjectCreate } from '../interfaces/project-create.interface';
import { IProjectUpdate } from '../interfaces/project-update.interface';
import { SyncerInstancesService } from '@/modules/syncer/services/syncer-instances.service';
import { IProjectGroupUpdate } from '../interfaces/project-group-update.interface';
import { IProjectGroupCreate } from '../interfaces/project-group-create.interface';
import { ProjectsHelperService } from './projects-helper.service';


@Injectable()
export class ProjectGroupsService {


  constructor(
    @InjectModel(ProjectGroup.name) 
    private readonly project_group_model: Model<TProjectGroupDocument>,

    private readonly projects_helper_service: ProjectsHelperService,
  ) {}


  async select(user: TUserDocument): Promise<TProjectGroupDocument[]> {
    return await this.project_group_model.find({ user: user.id });
  }


  async getOrFail(user: TUserDocument, id: string): Promise<TProjectGroupDocument> {

    const project_group = await this.project_group_model.findOne({ _id: id, user: user.id });

    if(!project_group) {
      throw new InvalidInputException('NOT_FOUND', 'Entity not found');
    }

    return project_group;
  }


  async create(
    user: TUserDocument, 
    data: IProjectGroupCreate
  ): Promise<TProjectGroupDocument> {
    const project_group = new this.project_group_model({
      ...data,
      user: user.id,
    });
    await project_group.save();

    return project_group;
  }


  async update(
    user: TUserDocument, 
    project_group: TProjectGroupDocument,
    data: IProjectGroupUpdate
  ): Promise<TProjectGroupDocument> {

    await this.projects_helper_service.hasAccessOrFail(user, project_group);

    merge(project_group, data);
    
    return await project_group.save();
  }


  async delete(
    user: TUserDocument, 
    project_group: TProjectGroupDocument,
  ): Promise<void> {

    await this.projects_helper_service.hasAccessOrFail(user, project_group);
    
    await project_group.remove();
  }
}