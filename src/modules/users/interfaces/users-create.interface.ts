import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IUsersCreate {

  @Field()
  email: string;

  @Field()
  password: string;
  
}