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

@Resolver(of => SyncerEvent)
@UsePipes(new ValidationPipe({ transform: true }))
export class SyncerEventsResolver {

  constructor(
    private readonly event_emitter_events_service: EventEmitterEventsService,
    private readonly event_emitter_helpers_service: EventEmitterHelpersService,
  ) {}


  @Query(returns => [SyncerEvent])
  @UseGuards(GqlAuthGuard)
  async syncer_events(
    @UserParam() user: TUserDocument,
    @Args('filter') filter: ISyncerEventsFilter
  ): Promise<SyncerEvent[]> {
    return await this.event_emitter_events_service.select(user, filter);
  }


  @Mutation(returns => VoidScalar)
  @UseGuards(GqlAuthGuard)
  async syncerEventsProcess(
    @UserParam() user: TUserDocument,
    @Args('ids', { type: () => ObjectIdScalar }) ids: string[]
  ): Promise<boolean> {
    await this.event_emitter_events_service.processMany(user, ids);
    return true;
  }
}



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


  @Query(returns => [EventEmitterInstance])
  @UseGuards(GqlAuthGuard)
  async event_emitter_instance(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string
  ): Promise<EventEmitterInstance> {

    const eei = await this.event_emitter_instances_service.getOrFail(user, id);

    await this.event_emitter_helpers_service.hasAccessOrFail(eei, user);

    return eei;
  }
}