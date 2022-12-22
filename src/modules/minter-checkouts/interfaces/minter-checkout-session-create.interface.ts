import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
class IMinterCheckoutSessionCreateAssetInfo {

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
export class IMinterCheckoutSessionCreate {

  @Field(type => ObjectIdScalar)
  project: string;

  @Field()
  asset_info: IMinterCheckoutSessionCreateAssetInfo;
}