import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IUsersSignUp {

  @Field()
  email: string;

  @Field()
  password: string;
  
}