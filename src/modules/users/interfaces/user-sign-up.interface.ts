import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IUserSignUp {

  @Field()
  email: string;

  @Field()
  password: string;
  
}