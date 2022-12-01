import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { Project, TProjectDocument, User, TUserDocument, SyncerInstance, ProjectGroup } from "@/schemas";
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
import { ProjectGroupsService } from "./services/projects-groups.service";
import { IProjectGroupUpdate } from "./interfaces/project-group-update.interface";
import { IProjectGroupCreate } from "./interfaces/project-group-create.interface";

@Resolver(of => ProjectGroup)
@UsePipes(new ValidationPipe({ transform: true }))
export class ProjectGroupsResolver {

  constructor(
    private readonly project_groups_service: ProjectGroupsService,
  ) {}


  @Query(returns => [ProjectGroup])
  @UseGuards(GqlAuthGuard)
  async project_groups(
    @UserParam() user: TUserDocument,
  ): Promise<ProjectGroup[]> {
    return await this.project_groups_service.select(user);
  }


  @Query(returns => ProjectGroup)
  @UseGuards(GqlAuthGuard)
  async project_group(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<ProjectGroup> {
    return await this.project_groups_service.getOrFail(user, id);
  }


  @Mutation(returns => ProjectGroup)
  @UseGuards(GqlAuthGuard)
  async projectGroupCreate(
    @UserParam() user: TUserDocument,
    @Args('data') data: IProjectGroupCreate
  ): Promise<ProjectGroup> {
    return await this.project_groups_service.create(user, data);
  }


  @Mutation(returns => ProjectGroup)
  @UseGuards(GqlAuthGuard)
  async projectGroupUpdate(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: IProjectGroupUpdate
  ): Promise<ProjectGroup> {

    const pg = await this.project_groups_service.getOrFail(user, id);

    return await this.project_groups_service.update(user, pg, data);
  }


  @Mutation(returns => VoidScalar)
  @UseGuards(GqlAuthGuard)
  async projectGroupDelete(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<boolean> {

    const pg = await this.project_groups_service.getOrFail(user, id);

    await this.project_groups_service.delete(user, pg);

    return true;
  }
}