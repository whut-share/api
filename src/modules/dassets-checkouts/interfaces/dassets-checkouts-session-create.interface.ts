import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IDassetsCheckoutsSessionCreate {

  @Field()
  project: string;
}