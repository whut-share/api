import { AddressScalar, Keccak256Scalar, ObjectIdScalar } from "@/graphql/scalars";
import { TSyncerPreset } from "@/types";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class ISyncerInstanceUpdateContracts {

  @Field(type => AddressScalar, { nullable: true })
  address?: string;

  @Field(type => Keccak256Scalar, { nullable: true })
  deploy_tx?: string;

  @Field({ nullable: true })
  contract_name?: string;

  @Field(type => [String], { nullable: true })
  events?: string[];

  @Field(type => GraphQLJSON, { nullable: true })
  abi?: any;
}

@InputType()
export class ISyncerInstanceUpdate {

  @Field(type => ObjectIdScalar, { nullable: true })
  project?: string;

  @Field({ nullable: true })
  preset?: TSyncerPreset;

  @Field(type => [ISyncerInstanceUpdateContracts], { nullable: true })
  contracts?: ISyncerInstanceUpdateContracts[];

  metadata?: any;
}