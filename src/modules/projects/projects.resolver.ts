import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { Project, TProjectDocument, User, TUserDocument, SyncerInstance } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { ProjectsService } from "./services/projects.service";
import { IProjectCreate } from "./interfaces/project-create.interface";
import { IProjectUpdate } from "./interfaces/project-update.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Resolver(of => Project)
@UsePipes(new ValidationPipe({ transform: true }))
export class ProjectsResolver {

  constructor(
    private readonly projects_service: ProjectsService,

    @InjectModel(SyncerInstance.name)
    private readonly syncer_instance_model: Model<SyncerInstance>,
  ) {}


  @Query(returns => [Project])
  @UseGuards(GqlAuthGuard)
  async projects(
    @UserParam() user: TUserDocument,
  ): Promise<Project[]> {
    return await this.projects_service.select(user);
  }


  @Query(returns => Project)
  @UseGuards(GqlAuthGuard)
  async project(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<Project> {
    return await this.projects_service.getOrFail(user, id);
  }


  @ResolveField(returns => SyncerInstance)
  async minter_syncer_instance(
    @Parent() project: TProjectDocument,
  ): Promise<Project> {
    return await this.syncer_instance_model.findOne({
      project: project._id,
      preset: 'minter',
    });
  }


  @Mutation(returns => Project)
  @UseGuards(GqlAuthGuard)
  async projectCreate(
    @UserParam() user: TUserDocument,
    @Args('data') data: IProjectCreate
  ): Promise<Project> {
    return await this.projects_service.create(user, data);
  }


  @Mutation(returns => Project)
  @UseGuards(GqlAuthGuard)
  async projectUpdate(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: IProjectUpdate
  ): Promise<Project> {
    return await this.projects_service.update(user, id, data);
  }
}