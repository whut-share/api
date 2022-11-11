import { AddressScalar } from '@/graphql/scalars';
import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';


@Schema({
  toObject: {
    virtuals: true,
    getters: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  minimize: false
})
@ObjectType()
export class DassetsNftAssetInfo {

  @Prop({ required: true })
  @Field()
  public id: string;

  @Prop({ required: true })
  @Field()
  public name: string;

  @Prop()
  @Field({ nullable: true })
  public description?: string;

  @Prop()
  @Field({ nullable: true })
  public image_url?: string;

}

export const DassetsNftAssetInfoSchema = SchemaFactory.createForClass(DassetsNftAssetInfo);


@ObjectType()
export class DassetsCheckoutSessionPriceEstimate {
  @Field()
  price: number;

  @Field()
  total_eth: number;

  @Field()
  eth_price: number;

  @Field()
  gas_price: number;

  @Field()
  gas: number;

  @Field()
  slippage: number;
}

export type DassetsCheckoutSessionDocument = DassetsCheckoutSession & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  minimize: false
})
@ObjectType()
export class DassetsCheckoutSession extends BaseClass {

  public _id: ObjectId;

  @Field()
  public get id(): string {
    return this._id.toString();
  };

  @Prop({ required: true })
  @Field()
  public project: string;

  @Prop({ lowercase: true })
  @Field({ nullable: true })
  public address?: string;

  @Prop()
  @Field({ nullable: true })
  public mint_tx?: string;

  @Prop()
  @Field({ nullable: true })
  public mint_token_id?: number;

  @Prop()
  @Field({ nullable: true })
  public mint_request_id?: string;

  @Prop()
  @Field({ nullable: true })
  public payment_id?: string;

  @Prop()
  @Field({ nullable: true })
  public payment_expires_at?: Date;

  @Prop()
  @Field({ nullable: true })
  public network?: string;

  @Prop({ required: true })
  @Field()
  public contract_type: string;

  @Prop({ default: false })
  @Field()
  public is_succeeded: boolean;

  @Prop({ required: false })
  @Field()
  public expires_at: Date;

  @Prop({ required: true, type: DassetsNftAssetInfoSchema })
  @Field(type => DassetsNftAssetInfo)
  public asset_info: DassetsNftAssetInfo;

  @Prop({ default: false })
  @Field()
  public is_payed: boolean;

  @Field()
  public get url(): string {
    return `${process.env['DA_CHECKOUT_URL']}/${this.id}`
  };

  @Field()
  public get is_minted(): boolean {
    return this.mint_tx !== undefined;
  };

  @Field()
  public get is_expired(): boolean {
    return this.expires_at < new Date();
  };

  @Field({ nullable: true })
  public price_estimation?: DassetsCheckoutSessionPriceEstimate;

  public set stripe_pi_client_secret(val: string) {
    this._doc.stripe_pi_client_secret = val;
  }

  @Field({ nullable: true })
  public get stripe_pi_client_secret(): string | null {
    return this._doc.stripe_pi_client_secret || null;
  }

}

export const DassetsCheckoutSessionSchema = fixSchema(SchemaFactory.createForClass(DassetsCheckoutSession), DassetsCheckoutSession);

export const DassetsCheckoutSessionModelModule = MongooseModule.forFeatureAsync([
  {
    name: DassetsCheckoutSession.name,
    imports: [

    ],
    useFactory: defaultUseFactory(DassetsCheckoutSessionSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);
