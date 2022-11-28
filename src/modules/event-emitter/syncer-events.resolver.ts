import { UserParam } from "@/decorators";
import { ObjectIdScalar, VoidScalar } from "@/graphql/scalars";
import { GqlAuthGuard } from "@/guards";
import { SyncerEvent, TUserDocument } from "@/schemas";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ISyncerEventsFilter } from "./interfaces/syncer-events-filter.interface";
import { EventEmitterEventsService } from "./services/event-emitter-events.service";
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