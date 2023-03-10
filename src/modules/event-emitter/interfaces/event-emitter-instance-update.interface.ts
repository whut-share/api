import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IEventEmitterInstanceUpdate {
  
  @Field({ nullable: true })
  is_webhook_emitter?: boolean;

  @Field({ nullable: true })
  webhook_endpoint?: string;
}