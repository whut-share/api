import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IUserCreate {

  @Field()
  email: string;

  @Field()
  password: string;
  
}