import { AddressScalar } from "@/graphql/scalars";
import { InputType, Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class IAggregate {

  @Field(type => Int)
  count: number;
  
}