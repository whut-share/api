import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IEventEmitterInstancesFilter {
  
  @Field({ nullable: true })
  syncer_instance?: string;
}