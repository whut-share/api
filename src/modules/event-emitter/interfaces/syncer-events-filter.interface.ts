import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ISyncerEventsFilter {
  
  @Field(type => ObjectIdScalar, { nullable: true })
  event_emitter_instance?: string;

  @Field({ nullable: true })
  is_processed?: boolean;
}