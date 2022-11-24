import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ISyncerEventsFilter {
  
  @Field({ nullable: true })
  event_emitter_instance?: string;

  @Field({ nullable: true })
  is_processed?: boolean;
}