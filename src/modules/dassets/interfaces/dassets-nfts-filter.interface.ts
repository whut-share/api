import { ObjectIdScalar } from "@/graphql/scalars";
import { NetworkScalar } from "@/graphql/scalars/network.scalar";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IDassetsNftsFilter {
  
  @Field(type => NetworkScalar, { nullable: true })
  public network?: string;
}