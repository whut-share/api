import { AddressScalar } from '@/graphql/scalars';
import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { utils } from 'ethers';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

export type TDassetsNftDocument = DassetsNft & Document;

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
export class DassetsNft extends BaseClass {

  @Prop({ required: true })
  public _id: string;

  public id: string;

  @Prop({ required: true })
  @Field()
  public project: string;

  @Prop({ required: true, lowercase: true })
  @Field(type => AddressScalar)
  public owner: string;

  @Prop({ required: true })
  @Field()
  public mint_tx: string;

  @Prop({ required: true })
  @Field()
  public mint_block: number;

  @Prop({ required: true })
  @Field()
  public network: string;

  @Prop({ required: true })
  @Field()
  public token_id: number;

  @Prop({ required: true })
  @Field()
  public asset_id: string;

  @Prop({ required: true })
  @Field()
  public owner_synced_at: number;

  static formatId(network: string, token_id: number): string {
    return utils.keccak256(utils.toUtf8Bytes(`${network}_${token_id}`));
  }

}

export const DassetsNftSchema = fixSchema(SchemaFactory.createForClass(DassetsNft), DassetsNft);

export const DassetsNftModelModule = MongooseModule.forFeatureAsync([
  {
    name: DassetsNft.name,
    imports: [

    ],
    useFactory: defaultUseFactory(DassetsNftSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);