import { AddressScalar, NetworkScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IDassetsCheckoutSessionUpdate {

  @Field(type => AddressScalar, { nullable: true })
  address?: string;

  @Field(type => NetworkScalar, { nullable: true })
  network?: string;
}