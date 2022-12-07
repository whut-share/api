import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { Project, TProjectDocument, SyncerEvent, User, TUserDocument, EventEmitterInstance } from "@/schemas";
import { ObjectIdScalar, VoidScalar } from "@/graphql/scalars";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { EventEmitterEventsService } from "./services/event-emitter-events.service";
import { EventEmitterInstancesService } from "./services/event-emitter-instances.service";
import { ISyncerEventsFilter } from "./interfaces/syncer-events-filter.interface";
import { IEventEmitterInstancesFilter } from "./interfaces/event-emitter-instances-filter.interface";
import { EventEmitterHelpersService } from "./services/event-emitter-helpers.service";
import { IEventEmitterInstanceUpdate } from "./interfaces/event-emitter-instance-update.interface";
import { IEventEmitterInstanceCreate } from "./interfaces/event-emitter-instance-create.interface";

@Resolver(of => EventEmitterInstance)
@UsePipes(new ValidationPipe({ transform: true }))
export class EventEmitterInstancesResolver {

  constructor(
    private readonly event_emitter_instances_service: EventEmitterInstancesService,
    private readonly event_emitter_helpers_service: EventEmitterHelpersService,
  ) {}


  @Query(returns => [EventEmitterInstance])
  @UseGuards(GqlAuthGuard)
  async event_emitter_instances(
    @UserParam() user: TUserDocument,
    @Args('filter') filter: IEventEmitterInstancesFilter
  ): Promise<EventEmitterInstance[]> {
    return await this.event_emitter_instances_service.select(user, filter);
  }


  @Query(returns => EventEmitterInstance)
  @UseGuards(GqlAuthGuard)
  async event_emitter_instance(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string
  ): Promise<EventEmitterInstance> {

    const eei = await this.event_emitter_instances_service.getOrFail(user, id);

    await this.event_emitter_helpers_service.hasAccessOrFail(eei, user);

    return eei;
  }


  @Mutation(returns => EventEmitterInstance)
  @UseGuards(GqlAuthGuard)
  async eventEmitterInstanceUpdate(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: IEventEmitterInstanceUpdate,
  ): Promise<EventEmitterInstance> {
    const eei = await this.event_emitter_instances_service.getOrFail(user, id);
    return await this.event_emitter_instances_service.update(user, eei, data);
  }


  @Mutation(returns => EventEmitterInstance)
  @UseGuards(GqlAuthGuard)
  async eventEmitterInstanceCreate(
    @UserParam() user: TUserDocument,
    @Args('data') data: IEventEmitterInstanceCreate,
  ): Promise<EventEmitterInstance> {
    return await this.event_emitter_instances_service.create(user, data);
  }
}