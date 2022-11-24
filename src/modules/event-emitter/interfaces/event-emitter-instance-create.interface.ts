import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IEventEmitterInstanceCreate {
  
  @Field()
  is_webhook_emitter: boolean;

  @Field({ nullable: true })
  webhook_endpoint?: string;

  @Field(type => ObjectIdScalar)
  project: string;

  @Field(type => ObjectIdScalar)
  syncer_instance: string;
}