import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { User } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { HttpException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { UsersService } from "./services/users.service";
import { IUsersSignUp } from "./interfaces/users-sign-up.interface";
import { InvalidInputException } from "@/exceptions";

@Resolver(of => User)
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersResolver {

  constructor(
    private readonly users_service: UsersService,
  ) {}


  @Query(returns => User)
  @UseGuards(GqlAuthGuard)
  async me(
    @UserParam() user: User
  ): Promise<User> {
    return user;
  }


  @Query(returns => [User])
  async users(): Promise<User[]> {
    return await this.users_service.selectAll();
  }



  @Mutation(returns => User)
  async usersSignUp(
    @Args('data') data: IUsersSignUp
  ): Promise<User> {
    return await this.users_service.create(data);
  }
}