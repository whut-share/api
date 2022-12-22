import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { MinterCheckoutSession, MinterCheckoutSessionDocument, MinterCheckoutSessionPriceEstimate, User, TUserDocument } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { MinterCheckoutsService } from "./services/minter-checkouts.service";
import { IMinterCheckoutSessionCreate } from "./interfaces/minter-checkout-session-create.interface";
import { IMinterCheckoutSessionUpdate } from "./interfaces/minter-checkout-session-update.interface";

@Resolver(of => MinterCheckoutSession)
@UsePipes(new ValidationPipe({ transform: true }))
export class MinterCheckoutsResolver {

  constructor(
    private readonly minter_checkouts_service: MinterCheckoutsService,
  ) {}


  // @Query(returns => [MinterCheckoutSession])
  // @UseGuards(GqlAuthGuard)
  // async minter_checkouts(
  //   @UserParam() user: TUserDocument,
  // ): Promise<MinterCheckoutSessionDocument[]> {
  //   return await this.minter_checkouts_service.select(user);
  // }


  @Query(returns => MinterCheckoutSession)
  async minter_checkout_session(
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<MinterCheckoutSessionDocument> {
    return await this.minter_checkouts_service.getOrFail(id);
  }


  @ResolveField(returns => MinterCheckoutSessionPriceEstimate)
  async price_estimation(
    @Parent() dc_session: MinterCheckoutSessionDocument,
  ): Promise<MinterCheckoutSessionPriceEstimate> {

    if(!dc_session.network) {
      return null;
    }

    return await this.minter_checkouts_service.estimatePrice(dc_session);
  }


  @Mutation(returns => MinterCheckoutSession)
  @UseGuards(GqlAuthGuard)
  async minterCheckoutSessionCreate(
    @UserParam() user: TUserDocument,
    @Args('data') data: IMinterCheckoutSessionCreate
  ): Promise<MinterCheckoutSessionDocument> {
    return await this.minter_checkouts_service.create(user, data);
  }


  @Mutation(returns => MinterCheckoutSession)
  async minterCheckoutSessionUpdate(
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: IMinterCheckoutSessionUpdate
  ): Promise<MinterCheckoutSessionDocument> {
    const dc_session = await this.minter_checkouts_service.getOrFail(id);
    return await this.minter_checkouts_service.update(dc_session, data);
  }


  @Mutation(returns => MinterCheckoutSession)
  async minterCheckoutSessionAttachStripePaymentIntent(
    @Args('id', { type: () => ObjectIdScalar }) id: string
  ): Promise<MinterCheckoutSessionDocument> {
    const dc_session = await this.minter_checkouts_service.getOrFail(id);
    return await this.minter_checkouts_service.attachStripePaymentIntent(dc_session);
  }
}