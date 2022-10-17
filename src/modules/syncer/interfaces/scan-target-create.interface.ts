import { AddressScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

export class IScanTargetCreate {

  id: string;

  address: string;

  deploy_tx: string;

  network: string;

  is_inner_usage: boolean;

  events: string[];

  contract_name: string;
  
}