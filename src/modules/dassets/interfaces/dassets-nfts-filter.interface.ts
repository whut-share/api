import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IDassetsNftsFilter {
  
  @Field({ nullable: true })
  public network?: string;
}