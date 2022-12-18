import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { User } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { HttpException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChainNetwork } from "./chain-network-object-type";
import { chain_networks_list } from "./chain-networks-list";
import { ChainNetworksProvider } from "./chain-networks.provider";

@Resolver(of => ChainNetwork)
@UsePipes(new ValidationPipe({ transform: true }))
export class ChainNetworksResolver {

  constructor(
    private readonly chain_networks_provider: ChainNetworksProvider,
  ) {}

  @Query(returns => [ChainNetwork])
  async chain_networks(): Promise<ChainNetwork[]> {
    return this.chain_networks_provider.selectAll();
  }
}