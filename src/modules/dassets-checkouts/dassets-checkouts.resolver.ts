import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { DassetsCheckoutSession, DassetsCheckoutSessionDocument, DassetsCheckoutSessionPriceEstimate, User, UserDocument } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { DassetsCheckoutsService } from "./services/dassets-checkouts.service";
import { IDassetsCheckoutsSessionCreate } from "./interfaces/dassets-checkouts-session-create.interface";
import { IDassetsCheckoutsSessionUpdate } from "./interfaces/dassets-checkouts-session-update.interface";

@Resolver(of => DassetsCheckoutSession)
@UsePipes(new ValidationPipe({ transform: true }))
export class DassetsCheckoutsResolver {

  constructor(
    private readonly dassets_checkouts_service: DassetsCheckoutsService,
  ) {}


  // @Query(returns => [DassetsCheckoutSession])
  // @UseGuards(GqlAuthGuard)
  // async dassets_checkouts(
  //   @UserParam() user: UserDocument,
  // ): Promise<DassetsCheckoutSessionDocument[]> {
  //   return await this.dassets_checkouts_service.select(user);
  // }


  @Query(returns => DassetsCheckoutSession)
  async dassets_checkout_session(
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<DassetsCheckoutSessionDocument> {
    return await this.dassets_checkouts_service.getOrFail(id);
  }


  @ResolveField(returns => DassetsCheckoutSessionPriceEstimate)
  async price_estimation(
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<DassetsCheckoutSessionPriceEstimate> {
    const dc_session = await this.dassets_checkouts_service.getOrFail(id);
    return await this.dassets_checkouts_service.estimatePrice(dc_session);
  }


  @Mutation(returns => DassetsCheckoutSession)
  @UseGuards(GqlAuthGuard)
  async dassetsCheckoutSessionCreate(
    @UserParam() user: UserDocument,
    @Args('data') data: IDassetsCheckoutsSessionCreate
  ): Promise<DassetsCheckoutSessionDocument> {
    return await this.dassets_checkouts_service.create(user, data);
  }


  @Mutation(returns => DassetsCheckoutSession)
  async dassetsCheckoutSessionUpdate(
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: IDassetsCheckoutsSessionUpdate
  ): Promise<DassetsCheckoutSessionDocument> {
    const dc_session = await this.dassets_checkouts_service.getOrFail(id);
    return await this.dassets_checkouts_service.update(dc_session, data);
  }
}