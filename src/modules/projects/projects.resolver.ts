import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { Project, ProjectDocument, User, UserDocument } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { ProjectsService } from "./services/projects.service";
import { IProjectsCreate } from "./interfaces/projects-create.interface";
import { IProjectsUpdate } from "./interfaces/projects-update.interface";

@Resolver(of => Project)
@UsePipes(new ValidationPipe({ transform: true }))
export class ProjectsResolver {

  constructor(
    private readonly projects_service: ProjectsService,
  ) {}


  @Query(returns => [Project])
  @UseGuards(GqlAuthGuard)
  async projects(
    @UserParam() user: UserDocument,
  ): Promise<ProjectDocument[]> {
    return await this.projects_service.select(user);
  }


  @Query(returns => Project)
  @UseGuards(GqlAuthGuard)
  async project(
    @UserParam() user: UserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<ProjectDocument> {
    return await this.projects_service.getOrFail(user, id);
  }


  @Mutation(returns => Project)
  @UseGuards(GqlAuthGuard)
  async projectsCreate(
    @UserParam() user: UserDocument,
    @Args('data') data: IProjectsCreate
  ): Promise<ProjectDocument> {
    return await this.projects_service.create(user, data);
  }


  @Mutation(returns => Project)
  @UseGuards(GqlAuthGuard)
  async projectsUpdate(
    @UserParam() user: UserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: IProjectsUpdate
  ): Promise<ProjectDocument> {
    return await this.projects_service.update(user, id, data);
  }
}