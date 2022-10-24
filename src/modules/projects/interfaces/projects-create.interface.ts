import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IProjectsCreate {

  @Field()
  name: string;
  
}