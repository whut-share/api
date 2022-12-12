import { AddressScalar, Keccak256Scalar, ObjectIdScalar } from "@/graphql/scalars";
import { TSyncerPreset } from "@/types";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class ISyncerInstanceCreateContracts {

  @Field(type => AddressScalar, { nullable: true })
  address?: string;

  @Field(type => Keccak256Scalar, { nullable: true })
  deploy_tx?: string;

  @Field()
  contract_name: string;

  @Field(type => [String])
  events: string[];

  @Field(type => GraphQLJSON)
  abi: any;
}

@InputType()
export class ISyncerInstanceCreate {

  @Field(type => ObjectIdScalar)
  project: string;

  @Field({ nullable: true })
  preset?: TSyncerPreset;

  @Field(type => [ISyncerInstanceCreateContracts], { nullable: true })
  contracts?: ISyncerInstanceCreateContracts[];

  metadata?: any;
}