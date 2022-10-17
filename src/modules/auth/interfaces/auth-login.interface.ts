import { AddressScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

export class IAuthLogin {

  login: string;
  password: string;
  
}