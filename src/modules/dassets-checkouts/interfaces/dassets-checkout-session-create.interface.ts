import { Field, InputType } from "@nestjs/graphql";

@InputType()
class IDassetsCheckoutSessionCreateAssetInfo {

  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field({ nullable: true })
  public description?: string;

  @Field({ nullable: true })
  public image_url?: string;
}

@InputType()
export class IDassetsCheckoutSessionCreate {

  @Field()
  project: string;

  @Field()
  asset_info: IDassetsCheckoutSessionCreateAssetInfo;
}