import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IEventEmitterInstancesFilter {
  
  @Field(type => ObjectIdScalar, { nullable: true })
  syncer_instance?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  search?: string;
}