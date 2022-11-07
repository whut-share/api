import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IWebhookEndpointUpdate {

  @Field({ nullable: true })
  url: string;

  @Field({ nullable: true })
  key: string;
}