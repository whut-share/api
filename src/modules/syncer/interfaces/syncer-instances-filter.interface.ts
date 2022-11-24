import { ObjectIdScalar } from "@/graphql/scalars";
import { TSyncerPreset } from "@/types";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class ISyncerInstancesFilter {

  @Field(type => ObjectIdScalar)
  project: string;
}