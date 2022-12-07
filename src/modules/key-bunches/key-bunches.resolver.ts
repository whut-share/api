import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { KeyBunch, TKeyBunchDocument, User, TUserDocument, SyncerInstance } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { KeyBunchesService } from "./services/key-bunches.service";
import { IKeyBunchCreate } from "./interfaces/key-bunch-create.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Resolver(of => KeyBunch)
@UsePipes(new ValidationPipe({ transform: true }))
export class KeyBunchesResolver {

  constructor(
    private readonly key_bunches_service: KeyBunchesService,
  ) {}


  @Query(returns => [KeyBunch])
  @UseGuards(GqlAuthGuard)
  async key_bunches(
    @UserParam() user: TUserDocument,
  ): Promise<KeyBunch[]> {
    return await this.key_bunches_service.select(user);
  }


  @Query(returns => KeyBunch)
  @UseGuards(GqlAuthGuard)
  async key_bunch(
    @UserParam() user: TUserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<KeyBunch> {
    return await this.key_bunches_service.getOrFail(user, id);
  }


  @Mutation(returns => KeyBunch)
  @UseGuards(GqlAuthGuard)
  async keyBunchCreate(
    @UserParam() user: TUserDocument,
    @Args('data') data: IKeyBunchCreate
  ): Promise<KeyBunch> {
    return await this.key_bunches_service.create(user, data);
  }
}