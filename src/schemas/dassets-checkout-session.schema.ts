import { AddressScalar } from '@/graphql/scalars';
import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

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
    virtuals: true
  },
  toJSON: {
    virtuals: true
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
  @Field()
  public address?: string;

  @Prop()
  @Field()
  public mint_tx?: string;

  @Prop()
  @Field()
  public mint_request_id?: string;

  @Prop()
  @Field()
  public minted_token_id?: number;

  @Prop()
  @Field()
  public payment_id?: string;

  @Prop()
  @Field()
  public network?: string;

  @Prop({ required: true })
  @Field()
  public contract_type: string;

  @Prop({ default: false })
  @Field()
  public is_succeeded: boolean;

  @Prop({ required: false })
  @Field()
  public expire_at: Date;

  @Field()
  public get url(): string {
    return `${process.env['DA_CHECKOUT_URL']}/${this.id}`
  };

  @Field({ nullable: true })
  public price_estimation: DassetsCheckoutSessionPriceEstimate;

}

export const DassetsCheckoutSessionSchema = SchemaFactory.createForClass(DassetsCheckoutSession);

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
