import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IDassetsCheckoutsSessionUpdate {

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  network?: string;
}