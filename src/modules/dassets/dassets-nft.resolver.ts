import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { DassetsNft, TDassetsNftDocument, User, TUserDocument } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { DassetsNftsService } from "./services/dassets-nfts.service";
import { IDassetsNftsFilter } from "./interfaces/dassets-nfts-filter.interface";

@Resolver(of => DassetsNft)
@UsePipes(new ValidationPipe({ transform: true }))
export class DassetsNftsResolver {

  constructor(
    private readonly dassets_nfts_service: DassetsNftsService,
  ) {}


  @Query(returns => [DassetsNft])
  @UseGuards(GqlAuthGuard)
  async dassets_nfts(
    @UserParam() user: TUserDocument,
    @Args('filter', { nullable: true }) filter: IDassetsNftsFilter,
  ): Promise<DassetsNft[]> {
    return await this.dassets_nfts_service.select(user, filter);
  }


  @Query(returns => DassetsNft)
  @UseGuards(GqlAuthGuard)
  async dassets_nft(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<DassetsNft> {
    return await this.dassets_nfts_service.getOrFail(id);
  }
}