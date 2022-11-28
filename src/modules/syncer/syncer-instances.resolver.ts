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
import { SyncerInstancesService } from "./services/syncer-instances.service";
import { ISyncerInstancesFilter } from "./interfaces/syncer-instances-filter.interface";
import { SyncerHelpersService } from "./services/syncer-helpers.service";
import { ISyncerInstanceCreate } from "./interfaces/syncer-instance-create.interface";
import { ISyncerInstanceUpdate } from "./interfaces/syncer-instance-update.interface";

@Resolver(of => SyncerInstance)
@UsePipes(new ValidationPipe({ transform: true }))
export class SyncerInstancesResolver {

  constructor(
    private readonly syncer_instances_service: SyncerInstancesService,
    private readonly syncer_helpers_service: SyncerHelpersService,
  ) {}


  @Query(returns => [SyncerInstance])
  @UseGuards(GqlAuthGuard)
  async syncer_instances(
    @UserParam() user: TUserDocument,
    @Args('filter') filter: ISyncerInstancesFilter,
  ): Promise<SyncerInstance[]> {
    return await this.syncer_instances_service.select(user, filter);
  }


  @Query(returns => SyncerInstance)
  @UseGuards(GqlAuthGuard)
  async syncer_instance(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<SyncerInstance> {

    const syncer_instance = await this.syncer_instances_service.getOrFail(user, id);

    await this.syncer_helpers_service.hasAccessOrFail(syncer_instance, user);

    return syncer_instance;
  }


  @Mutation(returns => SyncerInstance)
  @UseGuards(GqlAuthGuard)
  async syncerInstanceCreate(
    @UserParam() user: TUserDocument,
    @Args('data') data: ISyncerInstanceCreate
  ): Promise<SyncerInstance> {
    return await this.syncer_instances_service.create(user, data);
  }


  @Mutation(returns => SyncerInstance)
  @UseGuards(GqlAuthGuard)
  async syncerInstanceUpdate(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: ISyncerInstanceUpdate
  ): Promise<SyncerInstance> {
    const syncer_instance = await this.syncer_instances_service.getOrFail(user, id);
    return await this.syncer_instances_service.update(user, syncer_instance, data);
  }


  @Mutation(returns => VoidScalar)
  @UseGuards(GqlAuthGuard)
  async syncerInstanceDelete(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<boolean> {
    const syncer_instance = await this.syncer_instances_service.getOrFail(user, id);
    await this.syncer_instances_service.delete(user, syncer_instance);
    return true;
  }
}