import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IProjectCreate {

  @Field()
  name: string;
  
}