import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IWebhookEndpointsCreate {
  
  @Field(type => ObjectIdScalar)
  project: string;

  @Field({ nullable: true })
  url: string;

  @Field({ nullable: true })
  key: string;
}