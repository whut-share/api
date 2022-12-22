import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { MinterNft, TMinterNftDocument, User, TUserDocument } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { MinterNftsService } from "./services/minter-nfts.service";
import { IMinterNftsFilter } from "./interfaces/minter-nfts-filter.interface";

@Resolver(of => MinterNft)
@UsePipes(new ValidationPipe({ transform: true }))
export class MinterNftsResolver {

  constructor(
    private readonly minter_nfts_service: MinterNftsService,
  ) {}


  @Query(returns => [MinterNft])
  @UseGuards(GqlAuthGuard)
  async minter_nfts(
    @UserParam() user: TUserDocument,
    @Args('filter', { nullable: true }) filter: IMinterNftsFilter,
  ): Promise<MinterNft[]> {
    return await this.minter_nfts_service.select(user, filter);
  }


  @Query(returns => MinterNft)
  @UseGuards(GqlAuthGuard)
  async minter_nft(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<MinterNft> {
    return await this.minter_nfts_service.getOrFail(id);
  }
}