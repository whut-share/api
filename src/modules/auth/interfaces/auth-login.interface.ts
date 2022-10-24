import { AddressScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

export class IAuthLogin {

  email: string;
  password: string;
  
}