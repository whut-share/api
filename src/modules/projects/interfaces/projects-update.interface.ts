import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IProjectsDassetsDataUpdate {

  @Field(type => [String], { nullable: true })
  include_networks?: string[];

  @Field({ nullable: true })
  token_base_url?: string;

  @Field({ nullable: true })
  webhook_events_url?: string;
}

@InputType()
export class IProjectsUpdate {

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  dassets?: IProjectsDassetsDataUpdate;
  
}