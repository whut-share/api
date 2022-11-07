import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import * as Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { WebhookEndpoint, WebhookEndpointDocument, User, UserDocument } from "@/schemas";
import { ObjectIdScalar } from "@/graphql/scalars";
import { IPagination, ISort } from "@/interfaces";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GqlAuthGuard } from "@/guards";
import { UserParam } from "@/decorators";
import { VoidScalar } from "@/graphql/scalars/void.scalar";
import { IAggregate } from "@/interfaces";
import { WebhookEndpointsService } from "./services/webhook-endpoints.service";
import { IWebhookEndpointCreate } from "./interfaces/webhook-endpoint-create.interface";
import { IWebhookEndpointUpdate } from "./interfaces/webhook-endpoint-update.interface";

@Resolver(of => WebhookEndpoint)
@UsePipes(new ValidationPipe({ transform: true }))
export class WebhookEndpointsResolver {

  constructor(
    private readonly webhook_endpoints_service: WebhookEndpointsService,
  ) {}


  @Query(returns => [WebhookEndpoint])
  @UseGuards(GqlAuthGuard)
  async webhook_endpoints(
    @UserParam() user: UserDocument,
  ): Promise<WebhookEndpointDocument[]> {
    return await this.webhook_endpoints_service.select(user);
  }


  @Query(returns => WebhookEndpoint)
  @UseGuards(GqlAuthGuard)
  async webhook_endpoint(
    @UserParam() user: UserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
  ): Promise<WebhookEndpointDocument> {
    return await this.webhook_endpoints_service.getOrFail(user, id);
  }


  @Mutation(returns => WebhookEndpoint)
  @UseGuards(GqlAuthGuard)
  async webhookEndpointCreate(
    @UserParam() user: UserDocument,
    @Args('data') data: IWebhookEndpointCreate
  ): Promise<WebhookEndpointDocument> {
    return await this.webhook_endpoints_service.create(user, data);
  }


  @Mutation(returns => WebhookEndpoint)
  @UseGuards(GqlAuthGuard)
  async webhookEndpointUpdate(
    @UserParam() user: UserDocument,
    @Args('id', { type: () => ObjectIdScalar }) id: string,
    @Args('data') data: IWebhookEndpointUpdate
  ): Promise<WebhookEndpointDocument> {
    const we = await this.webhook_endpoints_service.getOrFail(user, id);
    return await this.webhook_endpoints_service.update(user, we, data);
  }
}