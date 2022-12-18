import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ChainNetwork {

  @Field()
  id: string;

  @Field()
  default_rpc: string;

  @Field()
  archive_rpc: string;

  @Field()
  type: string;

  @Field()
  block_time: number;

  @Field()
  native_curr_symbol: string;

  @Field({ nullable: true })
  icon_url?: string;

}