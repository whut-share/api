import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IDassetsCheckoutSessionCreate {

  @Field()
  project: string;
}