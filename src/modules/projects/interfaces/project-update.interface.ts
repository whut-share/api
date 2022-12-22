import { NetworkScalar } from "@/graphql/scalars";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IProjectMinterSettingsUpdate {

  @Field(type => [NetworkScalar], { nullable: true })
  include_networks?: string[];

  @Field({ nullable: true })
  token_base_url?: string;

  @Field({ nullable: true })
  webhook_events_url?: string;
}

@InputType()
export class IProjectUpdate {

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  minter_settings?: IProjectMinterSettingsUpdate;
  
}